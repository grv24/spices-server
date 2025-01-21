import { Request, Response } from "express";
import { Admin, IAdmin } from "../models";
import { AdminService } from "../services";
import { handleError } from "./user.controller";

// Initialize the UserService instance
const adminService = new AdminService();

export class AdminController {
  // register
  async registerController(req: Request, res: Response) {
    try {
      const userData: IAdmin = req.body;
      const user = await adminService.register(userData);
      const { password, ...safeUserData } = user.toObject();

      res.status(201).json({
        status: true,
        message: "Admin registered successfully",
        data: safeUserData,
      });
    } catch (error) {
      console.error("Error registering admin:", error);
      handleError(res, error);
    }
  }

  // login
  async loginController(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required." });
      }

      const adminData = await adminService.login(email, password);

      res.status(200).json({
        status: true,
        message: "Admin login successful",
        data: adminData,
      });
    } catch (error) {
      console.error("Error logging in admin:", error);
      handleError(res, error);
    }
  }
//get current data
  async getAdminCurrentController(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await adminService.getCurrentAdmin(req.user._id);
      res.status(200).json({
        status: true,
        message: "Admin fetched successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error fetching admmin:", error);
      handleError(res, error);
    }
  }
}
