import { verifyAccessToken } from "../utils/jwt.js";
import { AuthenticationError } from "../utils/errorResponse.js";
import logger from "../utils/logger.js";

/**
 * Authenticate middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError("No authorization header");
    }

    // Extract token (Bearer <token>)
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new AuthenticationError("Invalid authorization header format");
    }

    const token = parts[1];

    // Verify token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new AuthenticationError("Invalid or expired token");
    }

    // Attach user to request
    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(error.statusCode || 401).json({
      success: false,
      message: error.message,
      code: error.code || "AUTHENTICATION_ERROR",
    });
  }
};

/**
 * Authorization middleware
 * Checks if user has required roles
 */
export const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // User must be authenticated first
      if (!req.user || !req.user.userId) {
        throw new AuthenticationError("User not authenticated");
      }

      // For now, we're just passing through
      // Full authorization will be added when we have Role model
      // This is a placeholder for team/project-level RBAC

      next();
    } catch (error) {
      logger.error("Authorization error:", error);
      res.status(error.statusCode || 403).json({
        success: false,
        message: error.message,
        code: error.code || "AUTHORIZATION_ERROR",
      });
    }
  };
};

export default {
  authenticate,
  authorize,
};
