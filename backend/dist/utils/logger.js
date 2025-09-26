"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLoggerStream = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const chalk_1 = __importDefault(require("chalk"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const app_config_1 = require("../config/app.config");
const { combine, printf, errors, colorize } = winston_1.format;
// Ensure logs directory exists
const logDir = path_1.default.resolve("logs");
if (!fs_1.default.existsSync(logDir))
    fs_1.default.mkdirSync(logDir);
// Format timestamp as [YYYY-MM-DD HH:mm:ss]
const formatTimestamp = (iso) => {
    const date = new Date(iso);
    return `[${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}]`;
};
// Map log levels to colors
const levelColors = {
    INFO: chalk_1.default.green,
    WARN: chalk_1.default.yellow,
    ERROR: chalk_1.default.red,
    DEBUG: chalk_1.default.blue,
    VERBOSE: chalk_1.default.magenta,
};
// Map HTTP status codes to colors
const colorStatus = (status) => {
    if (status >= 500)
        return chalk_1.default.red(status);
    if (status >= 400)
        return chalk_1.default.redBright(status);
    if (status >= 300)
        return chalk_1.default.yellow(status);
    if (status >= 200)
        return chalk_1.default.green(status);
    return chalk_1.default.white(status);
};
// Type guard for HttpMeta
function isHttpMeta(meta) {
    return (meta &&
        meta.component === "http" &&
        typeof meta.method === "string" &&
        typeof meta.url === "string" &&
        typeof meta.status === "number" &&
        typeof meta.responseTime === "string");
}
// Common formatter
const createLogFormatter = (stripAnsiCodes = false) => printf(({ level, message, timestamp, stack, ...meta }) => {
    const logLevel = (level || "INFO").toUpperCase();
    const ts = typeof timestamp === "string" ? timestamp : new Date().toISOString();
    const colorFn = levelColors[logLevel] || ((txt) => txt); // <-- use levelColors
    // HTTP logs
    if (isHttpMeta(meta)) {
        const line = `[${colorFn(logLevel)}] ${formatTimestamp(ts)} : ${chalk_1.default.cyan(meta.method)} ${chalk_1.default.green(meta.url)} ${colorStatus(meta.status)} ${chalk_1.default.magenta(meta.responseTime)} reqId=${chalk_1.default.blue(meta.requestId || "-")} IP=${meta.ip || "-"}`;
        return stripAnsiCodes ? (0, strip_ansi_1.default)(line) : line;
    }
    // Generic logs
    const metaString = Object.entries(meta)
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(" ");
    const line = `[${colorFn(logLevel)}] ${formatTimestamp(ts)} : ${stack || message} ${metaString}`;
    return stripAnsiCodes ? (0, strip_ansi_1.default)(line) : line;
});
// Winston logger
const logger = (0, winston_1.createLogger)({
    level: app_config_1.config.LOG_LEVEL || "info",
    format: combine(errors({ stack: true })),
    transports: [
        // File logs (ANSI stripped)
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logDir, "application-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxFiles: "14d",
            zippedArchive: true,
            level: "info",
            format: createLogFormatter(true),
        }),
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logDir, "error-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxFiles: "30d",
            zippedArchive: true,
            level: "error",
            format: createLogFormatter(true),
        }),
    ],
});
// Console logs (keep colors)
if (app_config_1.config.NODE_ENV !== "production") {
    logger.add(new winston_1.transports.Console({
        format: combine(createLogFormatter(false), colorize({ all: false })),
    }));
}
// Handle uncaught exceptions
logger.exceptions.handle(new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logDir, "exceptions-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d",
    zippedArchive: true,
    format: createLogFormatter(true),
}));
// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    throw reason;
});
// HTTP logging via Morgan
exports.httpLoggerStream = {
    write: (req, res, responseTime) => {
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
exports.default = logger;
//# sourceMappingURL=logger.js.map