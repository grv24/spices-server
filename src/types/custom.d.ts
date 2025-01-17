// src/types/custom.d.ts
import { IUser } from "../models"; // Adjust path to your IUser model

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
