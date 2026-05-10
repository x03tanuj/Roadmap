import { errorResponse, ApiError } from "../utils/errorResponse.js";
import logger from "../utils/logger.js";

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  logger.error("Global error handler:", {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });

  // Default error
  if (!(err instanceof ApiError)) {
    // Mongoose validation error
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: Object.values(err.errors).map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        code: "CONFLICT",
      });
    }

    // Unexpected error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  }

  // ApiError
  res.status(err.statusCode || 500).json(errorResponse(err));
};

/**
 * 404 not found middleware
 */
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    code: "NOT_FOUND",
  });
};

export default {
  errorHandler,
  notFound,
};
