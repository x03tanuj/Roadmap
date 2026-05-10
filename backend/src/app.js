import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import envConfig from "./config/environment.js";
import requestLogger from "./middleware/requestLogger.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";
import logger from "./utils/logger.js";

const app = express();

/**
 * Trust proxy (for rate limiting behind nginx)
 */
app.set("trust proxy", 1);

/**
 * CORS Middleware
 */
app.use(
  cors({
    origin: envConfig.corsOrigin.split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/**
 * Body parsing
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/**
 * Request logging
 */
app.use(requestLogger);

/**
 * Rate limiting
 */
const limiter = rateLimit({
  windowMs: envConfig.rateLimit.windowMs,
  max: envConfig.rateLimit.maxRequests,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.use("/api/v1", apiRoutes);

/**
 * 404 Handler
 */
app.use(notFound);

/**
 * Error Handler (must be last)
 */
app.use(errorHandler);

export default app;
