import { Response } from "express";
import {
  HTTPSTATUS,
  HttpStatusCodeType,
  HttpStatusMessageMap,
} from "../config/http.config";

interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: HttpStatusCodeType;
  success?: boolean;
  message: string;
  data?: T;
  meta?: Record<string, any>;
  requestId?: string;
}

export const sendResponse = <T>({
  res,
  statusCode = HTTPSTATUS.OK,
  success = true,
  message,
  data,
  meta,
  requestId,
}: ApiResponseOptions<T>): void => {
  const response: Record<string, any> = {
    success,
    message,
    statusCode,
    statusText: HttpStatusMessageMap[statusCode] || "Unknown Status",
    timestamp: new Date().toISOString(),
    requestId: requestId ?? res.locals.requestId, // fallback to middleware-generated ID
  };

  if (data !== undefined) response.data = data;
  if (meta && Object.keys(meta).length > 0) response.meta = meta;

  res.status(statusCode).json(response);
};
