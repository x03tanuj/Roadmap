import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import { initializeRedis } from "./src/config/redis.js";
import envConfig from "./src/config/environment.js";
import logger from "./src/utils/logger.js";

let server;

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Initialize Redis
    await initializeRedis();

    // Start Express server
    server = app.listen(envConfig.port, () => {
      logger.info(
        `🚀 Server running at http://localhost:${envConfig.port} (${envConfig.nodeEnv})`,
      );
    });

    // Handle graceful shutdown
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

/**
 * Graceful shutdown
 */
const shutdown = () => {
  logger.info("Shutting down gracefully...");

  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error("Forced shutdown");
      process.exit(1);
    }, 10000);
  }
};

// Start the server
startServer();
