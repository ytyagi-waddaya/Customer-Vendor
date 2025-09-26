import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import logger from "../utils/logger";


export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof AppError) {
    logger.error(`${err.name}: ${err.message}`, {
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

  logger.error("Unhandled error", {
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
