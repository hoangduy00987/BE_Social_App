import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DB_HOST?: string;
  DB_PORT?: number;
  DB_USER?: string;
  DB_PASS?: string;
  DB_NAME?: string;
  ACCESS_SECRET?: string;
  CORS_ALLOWED_ORIGIN: string[];
  KAFKA_BROKERS: string;
  REDIS_URL: string;
  USER_SERVICE_URL: string;
  COMMUNITY_SERVICE_URL: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}

const envConfig: EnvConfig = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  ACCESS_SECRET: process.env.ACCESS_SECRET,
  CORS_ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN?.split(",") || [
    "http://localhost:3000",
    "http://localhost:8081",
  ],
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || "localhost:9092",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || "http://localhost:3000",
  COMMUNITY_SERVICE_URL: process.env.COMMUNITY_SERVICE_URL || "http://localhost:3003",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default envConfig;
