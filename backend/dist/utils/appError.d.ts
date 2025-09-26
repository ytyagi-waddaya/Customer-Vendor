import { HttpStatusCodeType } from "../config/http.config";
import { ErrorCodeEnumType } from "../enums/error-code.enum";
export declare class AppError extends Error {
    readonly name: string;
    readonly statusCode: HttpStatusCodeType;
    readonly errorCode: ErrorCodeEnumType;
    readonly details?: Record<string, any> | undefined;
    constructor(message: string, statusCode?: HttpStatusCodeType, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class HttpException extends AppError {
    constructor(message: string | undefined, statusCode: HttpStatusCodeType, errorCode: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class InternalServerException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class NotFoundException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class BadRequestException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class UnauthorizedException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class ForbiddenException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class ConflictException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class TooManyRequestsException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class UnprocessableEntityException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
export declare class ValidationException extends AppError {
    constructor(message?: string, errorCode?: ErrorCodeEnumType, details?: Record<string, any>);
}
//# sourceMappingURL=appError.d.ts.map