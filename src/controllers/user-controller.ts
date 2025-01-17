import { Request, Response } from "express";
import { UserService } from "../services";
import { IUser } from "../models";

// Initialize the UserService instance
const userService = new UserService();

class UserController {
  async registerController(req: Request, res: Response) {
    try {
      const userData: IUser = req.body;
      // Call the register method from UserService
      const user = await userService.register(userData);

      // Respond with success and user data
      res.status(201).json({
        status: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        res.status(400).json({
          message: error.message,
        });
      } else {
        res.status(500).json({
          message: "Internal server error. Please try again later.",
        });
      }
    }
  }

  //login
  async loginController(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: "Email and Password are required. " });
        return;
      }
      const userData = await userService.login(email, password);

      // Respond with success and user data
      res.status(201).json({
        status: true,
        message: "User login successfully",
        data: userData,
      });
    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        res.status(400).json({
          message: error.message,
        });
      } else {
        res.status(500).json({
          message: "Internal server error. Please try again later.",
        });
      }
    }
  }

  //change password
  // async passwordChangeController(req: Request, res: Response) {
  //   try {
  //     const { currentPassword, newPassword } = req.body;
  //     const userId = req; 

  //     // Validate the request body
  //     if (!currentPassword || !newPassword) {
  //       res
  //         .status(400)
  //         .json({ message: "Current and new password are required." });
  //       return;
  //     }
  //     const result = await userService.changePassword(userId,currentPassword,newPassword)
  //   } catch (error) {
  //     // Handle errors
  //     if (error instanceof Error) {
  //       res.status(400).json({
  //         message: error.message,
  //       });
  //     } else {
  //       res.status(500).json({
  //         message: "Internal server error. Please try again later.",
  //       });
  //     }
  //   }
  // }
}

export default UserController;
