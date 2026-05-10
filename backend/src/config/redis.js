import { createClient } from "redis";
import envConfig from "./environment.js";
import logger from "../utils/logger.js";

let redisClient = null;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: envConfig.redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error("Redis: Max reconnect attempts reached");
            return new Error("Redis max retries reached");
          }
          return retries * 100; // Exponential backoff
        },
      },
    });

    redisClient.on("error", (err) => logger.error("Redis Client Error", err));
    redisClient.on("connect", () => logger.info("✓ Redis connected"));
    redisClient.on("disconnect", () => logger.warn("Redis disconnected"));

    await redisClient.connect();
    logger.info("✓ Redis initialized successfully");

    return redisClient;
  } catch (error) {
    logger.error("Failed to initialize Redis:", error.message);
    // Don't exit - Redis is optional for development
    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    logger.info("✓ Redis closed");
  }
};

export default { initializeRedis, getRedisClient, closeRedis };
