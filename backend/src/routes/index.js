import express from "express";
import authRoutes from "./v1/auth.js";
import teamRoutes from "./v1/teams.js";

const router = express.Router();

/**
 * API v1 Routes
 */

// Auth routes
router.use("/auth", authRoutes);

// Team routes
router.use("/teams", teamRoutes);

// More routes will be added here:
// router.use('/projects', projectRoutes);
// router.use('/tasks', taskRoutes);

export default router;
