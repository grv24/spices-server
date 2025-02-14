import { IUser } from "../models"; // Adjust path if necessary

declare global {
  namespace Express {
    interface User extends IUser {} // Extends Passport's `User` type
  }
}
