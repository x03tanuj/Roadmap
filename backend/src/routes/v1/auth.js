import express from "express";
import {
  signup,
  login,
  refresh,
  logout,
  getCurrentUser,
} from "../../controllers/authController.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

/**
 * POST /api/v1/auth/signup
 * Register new user
 * Public
 */
router.post("/signup", signup);

/**
 * POST /api/v1/auth/login
 * Login user
 * Public
 */
router.post("/login", login);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 * Public (uses refresh token)
 */
router.post("/refresh", refresh);

/**
 * POST /api/v1/auth/logout
 * Logout user
 * Public (client handles token cleanup)
 */
router.post("/logout", logout);

/**
 * GET /api/v1/auth/me
 * Get current user
 * Protected
 */
router.get("/me", authenticate, getCurrentUser);

export default router;
