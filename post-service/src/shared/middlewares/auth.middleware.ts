import { clerkClient, getAuth } from "@clerk/express";
import { randomInt } from "crypto";
import { Request, Response, NextFunction } from "express";

// export const authHandler = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   // Get userId from header
//   const userId = parseInt(req.header("X-User-Id") || "0") || randomInt(1, 10);
//   const userRole = req.header("X-User-Role") || "user";

//   // Check if no userId
//   if (!userId || !userRole) {
//     return res.status(401).json({ msg: "Authorization denied" });
//   }

//   // Verify userId
//   try {
//     req.user = { userId, userRole }; // Attach userId to the request
//     next(); // Pass control to the next middleware or route handler
//   } catch (err) {
//     res.status(401).json({ msg: "Authorization error" });
//   }
// };

export const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, isAuthenticated } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ message: "Authorization denied" });
  }

  // const user = await clerkClient.users.getUser(userId);
  const userList = await clerkClient.users.getUserList();
  const userIdList = userList.data.map((user) => user.id);

  const user_id = userIdList.indexOf(userId) + 1;

  req.user = { userId: user_id, userRole: "user" };
  next();
};
