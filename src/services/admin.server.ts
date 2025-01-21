import jwt from "jsonwebtoken";
import { Admin } from "../models";
import { IAdmin } from "../models";

export class AdminService {
  //register
  async register(userData: IAdmin): Promise<IAdmin> {
    const { email, password, username, role } = userData;

    // Check if user with the email already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    // Create a new user (password will be automatically hashed via the pre-save hook)
    const admin = new Admin({
      ...userData,
    });

    // Save the user to the database
    return await admin.save();
  }

  //login
  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await Admin.findOne({ email });
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
        username: user.username,
       
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "12h",
      }
    );
    return { token };
  }

   //get current admin
   async getCurrentAdmin(userId: string): Promise<IAdmin> {
    const admin = await Admin.findById(userId);
    if (!admin) {
      throw new Error("Admin not found");
    }
    return admin;
  }
}
