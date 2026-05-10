import express from "express";
import authRoutes from "./v1/auth.js";

const router = express.Router();

/**
 * API v1 Routes
 */

// Auth routes
router.use("/auth", authRoutes);

// More routes will be added here:
// router.use('/teams', teamRoutes);
// router.use('/projects', projectRoutes);
// router.use('/tasks', taskRoutes);

export default router;
