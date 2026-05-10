import Joi from "joi";
import { ValidationError } from "../utils/errorResponse.js";

/**
 * Signup validation schema
 */
const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
});

/**
 * Login validation schema
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

/**
 * Refresh token validation
 */
const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});

/**
 * Validate signup input
 */
export const validateSignup = (data) => {
  const { error, value } = signupSchema.validate(data, {
    abortEarly: false,
  });

  if (error) {
    const details = error.details.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    throw new ValidationError("Validation failed", details);
  }

  return value;
};

/**
 * Validate login input
 */
export const validateLogin = (data) => {
  const { error, value } = loginSchema.validate(data, {
    abortEarly: false,
  });

  if (error) {
    const details = error.details.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    throw new ValidationError("Validation failed", details);
  }

  return value;
};

/**
 * Validate refresh token
 */
export const validateRefreshToken = (data) => {
  const { error, value } = refreshTokenSchema.validate(data, {
    abortEarly: false,
  });

  if (error) {
    const details = error.details.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    throw new ValidationError("Validation failed", details);
  }

  return value;
};

export default {
  validateSignup,
  validateLogin,
  validateRefreshToken,
};
