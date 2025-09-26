import "dotenv/config";
import express from "express";
import { HTTPSTATUS } from "./config/http.config";
import { config } from "./config/app.config";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import userRoutes from "./routes/user.route";
import healthRoutes from "./routes/health.route";
import { AppError } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { requestIdMiddleware } from "./middlewares/requestIdMiddleware";
import { httpLoggerStream } from "./utils/logger";
import morgan from "morgan";

const app = express();

// Security
app.disable("x-powered-by");
if (config.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(helmet());
app.use(requestIdMiddleware);

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Enable gzip compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ------------------
// Morgan setup
// ------------------

// Add request ID token for Morgan
morgan.token("id", (req: any) => req.requestId || "-");

// Add response time in ms
morgan.token("response-time-ms", (req, res) => {
  // default morgan :response-time already gives in ms
  return "-";
});

// Use Morgan for logging HTTP requests
app.use(
  morgan(":id :method :url :status :response-time ms :remote-addr", {
    stream: {
      write: (message: string) => {
        // Parse the morgan message to extract info
      const parts = message.trim().split(" ");

      // Provide defaults to ensure they are strings
      const reqId = parts[0] ?? "-";
      const method = parts[1] ?? "-";
      const url = parts[2] ?? "-";
      const statusStr = parts[3] ?? "0"; // default "0" for parseInt
      const responseTime = parts[4] ?? "-";
      const ip = parts[6] ?? "-";

      const status = parseInt(statusStr, 10) || 0;

      httpLoggerStream.write(
        { method, originalUrl: url, requestId: reqId, ip },
        { statusCode: status },
        responseTime
      );
      },
    },
  })
);


// Routes
app.use("/health", healthRoutes);
// app.use("/api/test", testRoutes);
app.use("/api/user", userRoutes);

// 404 handler
app.use((req, res, next) => {
  next(
    new AppError(
      "Route not found",
      HTTPSTATUS.NOT_FOUND,
      ErrorCodeEnum.RESOURCE_NOT_FOUND
    )
  );
});

// Global error handler
app.use(globalErrorHandler);

export default app;
