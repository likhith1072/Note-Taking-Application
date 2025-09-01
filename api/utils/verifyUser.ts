import jwt from "jsonwebtoken";
import type { JwtPayload ,VerifyErrors } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "./error";

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.access_token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized: No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (    err: Parameters<jwt.VerifyCallback>[0],
    decoded: Parameters<jwt.VerifyCallback>[1]) => {
    if (err) {
      const message =
        err.name === "TokenExpiredError"
          ? "Session expired"
          : "Invalid token";
      return next(errorHandler(403, `Forbidden: ${message}`));
    }

       if (decoded) {
      req.user = decoded as JwtPayload & { id: string };
    }
    
    next();
  });
};
