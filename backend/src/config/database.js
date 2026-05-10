import mongoose from "mongoose";
import envConfig from "./environment.js";
import logger from "../utils/logger.js";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(envConfig.mongodbUri, {
      // Mongoose options
      serverSelectionTimeoutMS: 5000,
    });

    logger.info("✓ MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info("✓ MongoDB disconnected");
  } catch (error) {
    logger.error("Error disconnecting from MongoDB:", error);
  }
};

export default mongoose;
