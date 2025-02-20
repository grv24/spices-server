import { Request, Response } from "express";
import { UserService } from "../services";
import { IUser } from "../models";
import { stat } from "fs";
import passport from "passport";

// Initialize the UserService instance
const userService = new UserService();

// Utility for error handling
export const handleError = (res: Response, error: unknown) => {
  if (error instanceof Error) {
    res.status(400).json({ message: error.message, status: false });
  } else {
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

export class UserController {
  // register
  async registerController(req: Request, res: Response) {
    try {
      const userData: IUser = req.body;
      const user = await userService.register(userData);
      const { password, ...safeUserData } = user.toObject();

      res.status(201).json({
        status: true,
        message: "User registered successfully",
        data: safeUserData,
      });
    } catch (error) {
      console.error("Error registering user:", error);
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

      const userData = await userService.login(email, password, res);

      res.status(200).json({
        status: true,
        message: "User login successful",
        data: userData,
      });
    } catch (error) {
      console.error("Error logging in user:", error);
      handleError(res, error);
    }
  }
  // chngepassword
  async passwordChangeController(req: Request, res: Response) {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ message: "Old and new passwords are required." });
      }

      await userService.changePassword(user._id, oldPassword, newPassword);

      res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      handleError(res, error);
    }
  }

  async getUserCurrentController(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const user = await userService.getCurrentUser(req.user._id);
      res.status(200).json({
        status: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      handleError(res, error);
    }
  }
  async updateUserCurrentController(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.log( req.body,'req.body');
      const user = await userService.updateUser(req.user._id, req.body);
      res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      handleError(res, error);
    }
  }
  async getAllUserController(req: Request, res: Response) {
    try {
      const users = await userService.getAllUser();
      res.status(200).json({
        status: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      handleError(res, error);
    }
  }

  //create address
  async createAddressController(req: Request, res: Response) {
    try {
      const userId = req.user.id; // Assuming `user` is added to `req` via authentication middleware
      const result = await userService.createAddress(userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Update Address
  async updateAddressController(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;
      const result = await userService.updateAddress(
        userId,
        addressId,
        req.body
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Remove Address
  async removeAddressController(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;
      const result = await userService.removeAddress(userId, addressId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
  //get address
  async getAddress(req: Request, res: Response) {
    try {
      const userId = req.user._id; // Get user ID from request params
      const addresses = await userService.getAddressService(userId);

      return res.status(200).json({
        success: true,
        addresses,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
  //set default address
  async setDefault(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;

      if (!userId || !addressId) {
        return res.status(400).json({
          success: false,
          message: "User ID and Address ID are required",
        });
      }

      const result = await userService.isDefault(userId, addressId);

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  //logout
  async logoutController(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      await userService.logoutUser(res);
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.error("Error logging out user:", error);
      handleError(res, error);
    }
  }

  //google auth
  // Google Auth Redirect
  googleAuthController(req: Request, res: Response) {
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
  }

  // Google Callback
  googleAuthCallbackController(req: Request, res: Response) {
    passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
      if (err || !user) {
        return res.status(400).json({ message: "Authentication failed" });
      }

      req.login(user, (err) => {
        if (err) return res.status(500).json({ message: "Login error" });

        res.status(200).json({
          status: true,
          message: "Google login successful",
          data: user,
        });
      });
    })(req, res);
  }
}
