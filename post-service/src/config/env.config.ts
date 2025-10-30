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
  CORS_ALLOWED_ORIGIN: string[];
  KAFKA_BROKER: string;
}

const envConfig: EnvConfig = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  CORS_ALLOWED_ORIGIN: process.env.CORS_ALLOWED_ORIGIN?.split(",") || [
    "http://localhost:3000",
    "http://localhost:8081",
  ],
  KAFKA_BROKER: process.env.KAFKA_BROKER || "localhost:9093",
};

export default envConfig;
