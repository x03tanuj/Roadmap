import {
  signup as signupService,
  login as loginService,
  refreshAccessToken as refreshService,
  getUserById as getUserByIdService,
} from "../services/authService.js";
import {
  validateSignup,
  validateLogin,
  validateRefreshToken,
} from "../validators/authValidator.js";
import { successResponse, errorResponse } from "../utils/errorResponse.js";
import logger from "../utils/logger.js";

/**
 * POST /api/v1/auth/signup
 * Register a new user
 */
export const signup = async (req, res) => {
  try {
    // Validate input
    const { email, password, firstName, lastName } = validateSignup(req.body);

    // Call service
    const result = await signupService(email, password, firstName, lastName);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  } catch (error) {
    logger.error("Signup controller error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

/**
 * POST /api/v1/auth/login
 * Authenticate user and return tokens
 */
export const login = async (req, res) => {
  try {
    // Validate input
    const { email, password } = validateLogin(req.body);

    // Call service
    const result = await loginService(email, password);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
      },
    });
  } catch (error) {
    logger.error("Login controller error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 */
export const refresh = async (req, res) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    // Validate
    validateRefreshToken({ refreshToken });

    // Call service
    const result = await refreshService(refreshToken);

    // Return response
    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    logger.error("Refresh controller error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

/**
 * POST /api/v1/auth/logout
 * Logout user (client-side token deletion)
 */
export const logout = (req, res) => {
  try {
    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    logger.error("Logout controller error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

/**
 * GET /api/v1/auth/me
 * Get current user info (requires auth)
 */
export const getCurrentUser = async (req, res) => {
  try {
    // User ID is attached by auth middleware
    const user = await getUserByIdService(req.user.userId);

    res.status(200).json({
      success: true,
      message: "User retrieved",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    logger.error("Get current user error:", error);
    res.status(error.statusCode || 500).json(errorResponse(error));
  }
};

export default {
  signup,
  login,
  refresh,
  logout,
  getCurrentUser,
};
