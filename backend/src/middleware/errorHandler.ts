import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

interface CustomError extends Error {
  status?: number;
  code?: number;
  keyPattern?: any;
  errors?: any;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers["x-request-id"] || "unknown";
  
  logger.error(`Error [${requestId}]`, err, {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      requestId,
      details: Object.values(err.errors || {}).map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Invalid ID format",
      requestId,
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    return res.status(409).json({
      error: `${field} already exists`,
      requestId,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
      requestId,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expired",
      requestId,
    });
  }

  // Default error response
  const status = err.status || 500;
  const message = process.env.NODE_ENV === "production" 
    ? "Internal server error" 
    : err.message || "Internal server error";

  res.status(status).json({
    error: message,
    requestId,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
