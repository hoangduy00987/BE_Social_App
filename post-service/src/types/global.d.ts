/// <reference types="@clerk/express/env" />

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number | string;
        // userRole: string;
        email: string;
        is_admin: boolean;
      };
    }
  }
}

export {};
