/**
 * Standard API error response
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error
 */
export class ValidationError extends ApiError {
  constructor(message, details = null) {
    super(message, 400, "VALIDATION_ERROR");
    this.details = details;
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends ApiError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends ApiError {
  constructor(message = "You do not have permission") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

/**
 * Not found error
 */
export class NotFoundError extends ApiError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

/**
 * Conflict error (duplicate entry, etc.)
 */
export class ConflictError extends ApiError {
  constructor(message = "Resource already exists") {
    super(message, 409, "CONFLICT");
  }
}

/**
 * Create success response
 */
export const successResponse = (
  data,
  message = "Success",
  statusCode = 200,
) => {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
};

/**
 * Create error response
 */
export const errorResponse = (error, statusCode = 500) => {
  return {
    success: false,
    message: error.message || "Internal server error",
    code: error.code || "INTERNAL_ERROR",
    statusCode: error.statusCode || statusCode,
  };
};

export default {
  ApiError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  successResponse,
  errorResponse,
};
