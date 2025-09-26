"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const appError_1 = require("../utils/appError");
const logger_1 = __importDefault(require("../utils/logger"));
const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof appError_1.AppError) {
        logger_1.default.error(`${err.name}: ${err.message}`, {
            code: err.errorCode,
            details: err.details,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip,
        });
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errorCode: err.errorCode,
            ...(process.env.NODE_ENV !== "production" && {
                details: err.details,
                stack: err.stack,
            }),
            timestamp: new Date().toISOString(),
        });
        return;
    }
    logger_1.default.error("Unhandled error", {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
    });
    res.status(500).json({
        success: false,
        message: "Something went wrong",
        errorCode: "INTERNAL_SERVER_ERROR",
        ...(process.env.NODE_ENV !== "production" && {
            stack: err.stack,
        }),
        timestamp: new Date().toISOString(),
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map