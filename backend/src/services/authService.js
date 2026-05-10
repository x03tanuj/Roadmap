import User from "../models/User.js";
import {
  generateTokens,
  verifyRefreshToken,
  generateAccessToken,
} from "../utils/jwt.js";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../utils/errorResponse.js";
import logger from "../utils/logger.js";

/**
 * User signup
 * Creates new user account with email and password
 */
export const signup = async (email, password, firstName, lastName) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName: firstName || "",
      lastName: lastName || "",
    });

    await user.save();

    logger.info(`New user registered: ${user.email}`);

    // Generate tokens
    const tokens = generateTokens(user._id.toString());

    return {
      user: user.toJSON(),
      tokens,
    };
  } catch (error) {
    logger.error("Signup error:", error);
    throw error;
  }
};

/**
 * User login
 * Authenticates user and returns tokens
 */
export const login = async (email, password) => {
  try {
    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );

    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AuthenticationError("Your account has been disabled");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${user.email}`);

    // Generate tokens
    const tokens = generateTokens(user._id.toString());

    return {
      user: user.toJSON(),
      tokens,
    };
  } catch (error) {
    logger.error("Login error:", error);
    throw error;
  }
};

/**
 * Refresh access token
 * Validates refresh token and generates new access token
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AuthenticationError("Invalid or expired refresh token");
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new AuthenticationError("User not found or inactive");
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id.toString());

    logger.info(`Token refreshed for user: ${user.email}`);

    return {
      accessToken: newAccessToken,
    };
  } catch (error) {
    logger.error("Refresh token error:", error);
    throw error;
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  } catch (error) {
    logger.error("Get user error:", error);
    throw error;
  }
};

export default {
  signup,
  login,
  refreshAccessToken,
  getUserById,
};
