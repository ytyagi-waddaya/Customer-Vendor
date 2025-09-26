import { Response } from "express";
import { HttpStatusCodeType } from "../config/http.config";
interface ApiResponseOptions<T> {
    res: Response;
    statusCode?: HttpStatusCodeType;
    success?: boolean;
    message: string;
    data?: T;
    meta?: Record<string, any>;
    requestId?: string;
}
export declare const sendResponse: <T>({ res, statusCode, success, message, data, meta, requestId, }: ApiResponseOptions<T>) => void;
export {};
//# sourceMappingURL=response.d.ts.map