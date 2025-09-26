import { HTTPSTATUS, HttpStatusCodeType } from "../config/http.config";
import { ErrorCodeEnum, ErrorCodeEnumType } from "../enums/error-code.enum";


export class AppError extends Error {
  public readonly name: string;
  public readonly statusCode: HttpStatusCodeType;
  public readonly errorCode: ErrorCodeEnumType;
  public readonly details?: Record<string, any> | undefined;


  constructor(
    message: string,
    statusCode: HttpStatusCodeType = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.INTERNAL_SERVER_ERROR,
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// --- Specialized Exceptions ---

export class HttpException extends AppError {
  constructor(
    message = "Http Exception Error",
    statusCode: HttpStatusCodeType,
    errorCode: ErrorCodeEnumType,
    details?: Record<string, any>,
  ) {
    super(message, statusCode, errorCode, details);
  }
}

export class InternalServerException extends AppError {
  constructor(
    message = "Internal Server Error",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.INTERNAL_SERVER_ERROR,
    details?: Record<string, any>,
  ) {
    super(message, HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode, details);
  }
}

export class NotFoundException extends AppError {
  constructor(
    message = "Resource not found",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.RESOURCE_NOT_FOUND,
    details?: Record<string, any>,
  ) {
    super(message, HTTPSTATUS.NOT_FOUND, errorCode, details);
  }
}

export class BadRequestException extends AppError {
  constructor(
    message = "Bad Request",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.VALIDATION_ERROR,
    details?: Record<string, any>,
  ) {
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode, details);
  }
}

export class UnauthorizedException extends AppError {
  constructor(
    message = "Unauthorized Access",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.ACCESS_UNAUTHORIZED,
    details?: Record<string, any>,
  ) {
    super(message, HTTPSTATUS.UNAUTHORIZED, errorCode, details);
  }
}

export class ForbiddenException extends AppError {
  constructor(
    message = "Forbidden",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.ACCESS_UNAUTHORIZED,
    details?: Record<string, any>,
  ) {
    super(message, HTTPSTATUS.FORBIDDEN, errorCode, details);
  }
}

export class ConflictException extends AppError {
  constructor(
    message = "Conflict",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.VALIDATION_ERROR,
    details?: Record<string, any>,
  ) {
    super(message, HTTPSTATUS.CONFLICT, errorCode, details);
  }
}

export class TooManyRequestsException extends AppError {
  constructor(
    message = "Too Many Requests",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.AUTH_TOO_MANY_ATTEMPTS,
    details?: Record<string, any>,
  ) {
    super(message, HTTPSTATUS.TOO_MANY_REQUESTS, errorCode, details);
  }
}

export class UnprocessableEntityException extends AppError {
  constructor(
    message = "Unprocessable Entity",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.VALIDATION_ERROR,
    details?: Record<string, any>,
  ) {
    super(message, HTTPSTATUS.UNPROCESSABLE_ENTITY, errorCode, details);
  }
}

export class ValidationException extends AppError {
  constructor(
    message = "Validation failed",
    errorCode: ErrorCodeEnumType = ErrorCodeEnum.VALIDATION_ERROR,
    details?: Record<string, any>,
  ) {
    super(message, HTTPSTATUS.UNPROCESSABLE_ENTITY, errorCode, details);
  }
}
