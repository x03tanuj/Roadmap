import winston from "winston";
import envConfig from "../config/environment.js";

const logLevel = envConfig.isDevelopment ? "debug" : "info";

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "workflow-api" },
  transports: [
    // Error log
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    // Combined log
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Console output in development
if (envConfig.isDevelopment) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

export default logger;
