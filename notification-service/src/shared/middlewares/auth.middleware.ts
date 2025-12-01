import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env.js';

type JwtPayload = {
  sub: number;
  email: string;
  is_admin?: boolean;
  iat: number;
  exp: number;
};

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization') || '';

  let token: string | undefined;
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (typeof req.body?.access_token === 'string') {
    token = req.body.access_token;
  } else if (typeof req.query?.access_token === 'string') {
    token = String(req.query.access_token);
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied: missing token' });
  }

  if (!env.jwt.accessSecret) {
    return res.status(500).json({ message: 'JWT secret is not configured' });
  }

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret) as JwtPayload;

    // Attach user info to request (giữ đơn giản, không cần type augmentation phức tạp)
    (req as any).user = {
      id: payload.sub,
      email: payload.email,
      is_admin: payload.is_admin ?? false,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Authorization error: invalid or expired token' });
  }
}


