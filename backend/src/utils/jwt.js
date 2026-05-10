import jwt from "jsonwebtoken";
import envConfig from "../config/environment.js";
import logger from "./logger.js";

/**
 * Generate JWT access token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, envConfig.jwt.secret, {
    expiresIn: envConfig.jwt.expiresIn,
  });
};

/**
 * Generate JWT refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, envConfig.jwtRefresh.secret, {
    expiresIn: envConfig.jwtRefresh.expiresIn,
  });
};

/**
 * Generate both access and refresh tokens
 * @param {string} userId - User ID
 * @returns {object} { accessToken, refreshToken }
 */
export const generateTokens = (userId) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
};

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, envConfig.jwt.secret);
  } catch (error) {
    logger.error("Invalid access token:", error.message);
    return null;
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, envConfig.jwtRefresh.secret);
  } catch (error) {
    logger.error("Invalid refresh token:", error.message);
    return null;
  }
};

/**
 * Decode token without verification (use carefully)
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

export default {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  isTokenExpired,
};
