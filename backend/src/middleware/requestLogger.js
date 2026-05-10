import logger from "../utils/logger.js";

/**
 * Request logger middleware
 * Logs incoming requests and response details
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Generate unique request ID
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.id = requestId;

  // Log request
  logger.info({
    message: "Incoming request",
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (data) {
    const duration = Date.now() - startTime;

    logger.info({
      message: "Request completed",
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });

    return originalJson.call(this, data);
  };

  next();
};

export default requestLogger;
