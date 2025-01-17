import { User, IUser } from "../models";
import jwt from "jsonwebtoken";

class UserService {
  // Register a new user
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

  // User Login
  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
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
    return { token };
  }
  //change password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<string> {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    // Check if the current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error("Current password is incorrect.");
    }

    // Set the new password (this will trigger the pre-save hook and hash the password)
    user.password = newPassword;

    // Save the updated user
    await user.save();

    return "Password successfully updated.";
  }
}

export default UserService;
