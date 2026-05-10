import dotenv from "dotenv";

dotenv.config();

const envConfig = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/workflow",

  // Redis
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || "change_me_in_production",
    expiresIn: process.env.JWT_EXPIRE || "15m",
  },
  jwtRefresh: {
    secret: process.env.JWT_REFRESH_SECRET || "change_me_in_production",
    expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d",
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "15000"),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  },

  // Feature flags
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};

export default envConfig;
