import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import chalk from "chalk";
import stripAnsi from "strip-ansi";
import { config } from "../config/app.config";

interface HttpMeta {
  component: "http";
  method: string;
  url: string;
  status: number;
  responseTime: string;
  requestId?: string;
  ip?: string;
}

const { combine, printf, errors, colorize } = format;

// Ensure logs directory exists
const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// Format timestamp as [YYYY-MM-DD HH:mm:ss]
const formatTimestamp = (iso: string) => {
  const date = new Date(iso);
  return `[${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}]`;
};

// Map log levels to colors
const levelColors: Record<string, (msg: string) => string> = {
  INFO: chalk.green,
  WARN: chalk.yellow,
  ERROR: chalk.red,
  DEBUG: chalk.blue,
  VERBOSE: chalk.magenta,
};

// Map HTTP status codes to colors
const colorStatus = (status: number) => {
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.redBright(status);
  if (status >= 300) return chalk.yellow(status);
  if (status >= 200) return chalk.green(status);
  return chalk.white(status);
};

// Type guard for HttpMeta
function isHttpMeta(meta: any): meta is HttpMeta {
  return (
    meta &&
    meta.component === "http" &&
    typeof meta.method === "string" &&
    typeof meta.url === "string" &&
    typeof meta.status === "number" &&
    typeof meta.responseTime === "string"
  );
}

// Common formatter
const createLogFormatter = (stripAnsiCodes = false) =>
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const logLevel = (level || "INFO").toUpperCase();
    const ts = typeof timestamp === "string" ? timestamp : new Date().toISOString();
    const colorFn = levelColors[logLevel] || ((txt: string) => txt); // <-- use levelColors

    // HTTP logs
    if (isHttpMeta(meta)) {
      const line = `[${colorFn(logLevel)}] ${formatTimestamp(ts)} : ${chalk.cyan(meta.method)} ${chalk.green(
        meta.url
      )} ${colorStatus(meta.status)} ${chalk.magenta(meta.responseTime)} reqId=${chalk.blue(
        meta.requestId || "-"
      )} IP=${meta.ip || "-"}`;
      return stripAnsiCodes ? stripAnsi(line) : line;
    }

    // Generic logs
    const metaString = Object.entries(meta)
      .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
      .join(" ");
    const line = `[${colorFn(logLevel)}] ${formatTimestamp(ts)} : ${stack || message} ${metaString}`;
    return stripAnsiCodes ? stripAnsi(line) : line;
  });


// Winston logger
const logger = createLogger({
  level: config.LOG_LEVEL || "info",
  format: combine(errors({ stack: true })),
  transports: [
    // File logs (ANSI stripped)
    new DailyRotateFile({
      filename: path.join(logDir, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
      level: "info",
      format: createLogFormatter(true),
    }),
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      zippedArchive: true,
      level: "error",
      format: createLogFormatter(true),
    }),
  ],
});

// Console logs (keep colors)
if (config.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(createLogFormatter(false), colorize({ all: false })),
    })
  );
}

// Handle uncaught exceptions
logger.exceptions.handle(
  new DailyRotateFile({
    filename: path.join(logDir, "exceptions-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d",
    zippedArchive: true,
    format: createLogFormatter(true),
  })
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  throw reason;
});

// HTTP logging via Morgan
export const httpLoggerStream = {
  write: (req: any, res: any, responseTime: string) => {
    logger.info("HTTP request", {
      component: "http",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime,
      ip: req.ip,
      requestId: req.requestId || "-",
    });
  },
};

export default logger;
