import Redis from "ioredis";
import { Request, Response, NextFunction } from "express";
import envConfig from "../../config/env.config.js";

export const redis = new Redis(envConfig.REDIS_URL);

export function cache(ttlSeconds = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await redis.get(key);

    if (cached) {
      console.log("Cache hit:", key);
      return res.json(JSON.parse(cached));
    }

    const sendJson = res.json.bind(res);
    res.json = (data: any) => {
      redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
      return sendJson(data);
    };

    next();
  };
}
