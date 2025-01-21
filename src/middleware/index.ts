import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models";

interface JwtPayload {
  id: string;
  role: string;
}

// Extend Express Request object to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: any; // Replace `any` with the actual user type if available
  }
}

export const authenticateMiddleware = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || ""
      ) as JwtPayload;

      let user = null;

      if (allowedRoles.includes(decoded.role)) {
        user = await User.findById(decoded.id);
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user; // Attach user to request
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(403).json({ message: "Invalid token" });
    }
  };
};
