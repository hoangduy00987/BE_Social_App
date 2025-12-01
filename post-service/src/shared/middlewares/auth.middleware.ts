// import { clerkClient, getAuth } from "@clerk/express";
import { randomInt } from "crypto";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import envConfig from "../../config/env.config";

type JwtPayload = {
  sub: number;
  email: string;
  is_admin?: boolean;
  iat: number;
  exp: number;
};

export const authHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // // Get userId from header
  // const userId = parseInt(req.header("X-User-Id") || "0") || randomInt(1, 10);
  // const userRole = req.header("X-User-Role") || "user";

  // // Check if no userId
  // if (!userId || !userRole) {
  //   return res.status(401).json({ msg: "Authorization denied" });
  // }

  // // Verify userId
  // try {
  //   req.user = { userId, userRole }; // Attach userId to the request
  //   next(); // Pass control to the next middleware or route handler
  // } catch (err) {
  //   res.status(401).json({ msg: "Authorization error" });
  // }

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

  if (!envConfig.ACCESS_SECRET) {
    return res.status(500).json({ message: 'JWT secret is not configured' });
  }

  try {
    // jwt.verify returns string | JwtPayload, need to cast properly
    const decoded = jwt.verify(token, envConfig.ACCESS_SECRET);
    const payload = decoded as unknown as JwtPayload;

    req.user = {
      userId: payload.sub,
      email: payload.email,
      is_admin: payload.is_admin ?? false,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Authorization error: invalid or expired token' });
  }
};

// export const authHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { userId, isAuthenticated } = getAuth(req);

//   if (!isAuthenticated) {
//     return res.status(401).json({ message: "Authorization denied" });
//   }

//   // const user = await clerkClient.users.getUser(userId);
//   const userList = await clerkClient.users.getUserList();
//   const userIdList = userList.data.map((user) => user.id);

//   const user_id = userIdList.indexOf(userId) + 1;

//   req.user = { userId: user_id, userRole: "user" };
//   next();
// };
