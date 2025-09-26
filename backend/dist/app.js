"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_config_1 = require("./config/http.config");
const app_config_1 = require("./config/app.config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const hpp_1 = __importDefault(require("hpp"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const health_route_1 = __importDefault(require("./routes/health.route"));
const appError_1 = require("./utils/appError");
const error_code_enum_1 = require("./enums/error-code.enum");
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const requestIdMiddleware_1 = require("./middlewares/requestIdMiddleware");
const logger_1 = require("./utils/logger");
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
// Security
app.disable("x-powered-by");
if (app_config_1.config.NODE_ENV === "production")
    app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
app.use(requestIdMiddleware_1.requestIdMiddleware);
app.use((0, cors_1.default)({
    origin: app_config_1.config.FRONTEND_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "1mb" }));
app.use((0, cookie_parser_1.default)());
// Prevent HTTP Parameter Pollution
app.use((0, hpp_1.default)());
// Enable gzip compression
app.use((0, compression_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
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
morgan_1.default.token("id", (req) => req.requestId || "-");
// Add response time in ms
morgan_1.default.token("response-time-ms", (req, res) => {
    // default morgan :response-time already gives in ms
    return "-";
});
// Use Morgan for logging HTTP requests
app.use((0, morgan_1.default)(":id :method :url :status :response-time ms :remote-addr", {
    stream: {
        write: (message) => {
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
            logger_1.httpLoggerStream.write({ method, originalUrl: url, requestId: reqId, ip }, { statusCode: status }, responseTime);
        },
    },
}));
// Routes
app.use("/health", health_route_1.default);
// app.use("/api/test", testRoutes);
app.use("/api/user", user_route_1.default);
// 404 handler
app.use((req, res, next) => {
    next(new appError_1.AppError("Route not found", http_config_1.HTTPSTATUS.NOT_FOUND, error_code_enum_1.ErrorCodeEnum.RESOURCE_NOT_FOUND));
});
// Global error handler
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map