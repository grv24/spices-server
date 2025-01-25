import jwt from "jsonwebtoken";
import { User } from "../models";
import { Response } from "express";
import { IUser } from "../models";

export class UserService {
  //register
  async register(userData: IUser): Promise<IUser> {
    const { email, password, f_name, l_name, role } = userData;

    // Check if user with the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    // Create a new user (password will be automatically hashed via the pre-save hook)
    const user = new User({
      ...userData,
    });

    // Save the user to the database
    return await user.save();
  }

  //login
  async login(email: string, password: string,res: Response): Promise<{ token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }
    // const isMatch = await user.comparePassword(password);
    if (user.password != password) {
      throw new Error("Invalid credentials.");
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        firstName: user.f_name,
        lastName: user.l_name,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "12h",
      }
    );
    // Save the token in a cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
      domain: "localhost", // Ensure this matches your server's domain
      path: "/", 
    });
    return { token };
  }

  //chage passsword
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.password != oldPassword) {
      throw new Error("Old password is incorrect");
    }

    user.password = newPassword;
    // const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    // if (!isPasswordValid) {
    //   throw new Error("Old password is incorrect");
    // }
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
  }

  //get current user
  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  //update user
  async updateUser(userId: string, data: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  //forget password
  async forgetPassword() {}
  //logout
  async logoutUser() {}
  //delete user
  async deleteUser() {}
  //get all user
  async getAllUser(): Promise<IUser[]> {
    const users = await User.find();
    return users;
  }

  //send otp
  async sendOtp() {}
  //verify otp
  async verifyOtp() {}
}
