import { createLogger, format, transports } from "winston";
import morgan from "morgan";
import envConfig from "../../config/env.config.js";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: envConfig.NODE_ENV === "development" ? "http" : "warn", // Set default log level
  format: combine(
    colorize(), // Add colors to console output
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat,
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to a file
    new transports.File({ filename: "logs/combined.log" }), // Log all levels to a combined file
  ],
});

export const httpRequestLogger = morgan(
  envConfig.NODE_ENV === "development" ? "dev" : "common",
  { stream: { write: (message) => logger.http(message.trim()) } },
);
