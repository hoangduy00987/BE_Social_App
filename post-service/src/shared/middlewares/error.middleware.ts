import { Request, Response, NextFunction } from "express";
import { logger } from "./logger.middleware";
import envConfig from "../../config/env.config";

interface AppError extends Error {
  status: number;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err.stack);

  if (envConfig.NODE_ENV === "production") {
    res.status(500).json({ details: "Internal Server Error" });
    return;
  }

  res.status(err.status || 500).json({ details: err.message });
};

export default errorHandler;
