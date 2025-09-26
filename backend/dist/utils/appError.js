"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = exports.UnprocessableEntityException = exports.TooManyRequestsException = exports.ConflictException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = exports.NotFoundException = exports.InternalServerException = exports.HttpException = exports.AppError = void 0;
const http_config_1 = require("../config/http.config");
const error_code_enum_1 = require("../enums/error-code.enum");
class AppError extends Error {
    name;
    statusCode;
    errorCode;
    details;
    constructor(message, statusCode = http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode = error_code_enum_1.ErrorCodeEnum.INTERNAL_SERVER_ERROR, details) {
        super(message);
        this.name = new.target.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// --- Specialized Exceptions ---
class HttpException extends AppError {
    constructor(message = "Http Exception Error", statusCode, errorCode, details) {
        super(message, statusCode, errorCode, details);
    }
}
exports.HttpException = HttpException;
class InternalServerException extends AppError {
    constructor(message = "Internal Server Error", errorCode = error_code_enum_1.ErrorCodeEnum.INTERNAL_SERVER_ERROR, details) {
        super(message, http_config_1.HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode, details);
    }
}
exports.InternalServerException = InternalServerException;
class NotFoundException extends AppError {
    constructor(message = "Resource not found", errorCode = error_code_enum_1.ErrorCodeEnum.RESOURCE_NOT_FOUND, details) {
        super(message, http_config_1.HTTPSTATUS.NOT_FOUND, errorCode, details);
    }
}
exports.NotFoundException = NotFoundException;
class BadRequestException extends AppError {
    constructor(message = "Bad Request", errorCode = error_code_enum_1.ErrorCodeEnum.VALIDATION_ERROR, details) {
        super(message, http_config_1.HTTPSTATUS.BAD_REQUEST, errorCode, details);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends AppError {
    constructor(message = "Unauthorized Access", errorCode = error_code_enum_1.ErrorCodeEnum.ACCESS_UNAUTHORIZED, details) {
        super(message, http_config_1.HTTPSTATUS.UNAUTHORIZED, errorCode, details);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends AppError {
    constructor(message = "Forbidden", errorCode = error_code_enum_1.ErrorCodeEnum.ACCESS_UNAUTHORIZED, details) {
        super(message, http_config_1.HTTPSTATUS.FORBIDDEN, errorCode, details);
    }
}
exports.ForbiddenException = ForbiddenException;
class ConflictException extends AppError {
    constructor(message = "Conflict", errorCode = error_code_enum_1.ErrorCodeEnum.VALIDATION_ERROR, details) {
        super(message, http_config_1.HTTPSTATUS.CONFLICT, errorCode, details);
    }
}
exports.ConflictException = ConflictException;
class TooManyRequestsException extends AppError {
    constructor(message = "Too Many Requests", errorCode = error_code_enum_1.ErrorCodeEnum.AUTH_TOO_MANY_ATTEMPTS, details) {
        super(message, http_config_1.HTTPSTATUS.TOO_MANY_REQUESTS, errorCode, details);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
class UnprocessableEntityException extends AppError {
    constructor(message = "Unprocessable Entity", errorCode = error_code_enum_1.ErrorCodeEnum.VALIDATION_ERROR, details) {
        super(message, http_config_1.HTTPSTATUS.UNPROCESSABLE_ENTITY, errorCode, details);
    }
}
exports.UnprocessableEntityException = UnprocessableEntityException;
class ValidationException extends AppError {
    constructor(message = "Validation failed", errorCode = error_code_enum_1.ErrorCodeEnum.VALIDATION_ERROR, details) {
        super(message, http_config_1.HTTPSTATUS.UNPROCESSABLE_ENTITY, errorCode, details);
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=appError.js.map