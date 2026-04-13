import { ENV } from "../lib/env.js";

/**
 * Centralized Error Handling Middleware for Production
 */
export const errorMiddleware = (err, req, res, next) => {
  console.error(`[Error] ${err.stack || err.message}`);

  const statusCode = err.status || 500;
  
  // Sanitize error response for production
  const response = {
    message: err.message || "Internal server error",
  };

  // Only leak stack trace in development
  if (ENV.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
