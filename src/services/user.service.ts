import jwt from "jsonwebtoken";
import { Cart, User } from "../models";
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
  async login(
    email: string,
    password: string,
    res: Response
  ): Promise<{ token: string }> {
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
        addresses: user.addresses,
        mobile:user.phone
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "12h",
      }
    );
    // Save the token in a cookie
    res.cookie("token", token, {
      httpOnly: false, // Prevents client-side access to the cookie
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
    const cart = await Cart.find({ userId }).populate("productId");
    console.log(cart, user);
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
  //create adddress
  async createAddress(userId: string, newAddress: any) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      const existingAddresses = user.addresses;
      if (existingAddresses.length == 0) {
        // Add new address
        user.addresses.push(newAddress);
        await user.save();
        return {
          success: true,
          message: "Address added successfully",
          addresses: user.addresses,
        };
      } else {
        // Set existing addresses' is_default to false
        await Promise.all(
          existingAddresses.map(async (address) => {
            address.isDefault = false;
          })
        );
        user.addresses.push(newAddress);
        user.save();
        return {
          success: true,
          message: "Address added successfully",
          addresses: user.addresses,
        };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  //update address
  async updateAddress(userId: string, addressId: string, updatedData: any) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      // Find the address to update
      const address = user.addresses.find(
        (addr) => addr._id.toString() === addressId
      );
      if (!address) throw new Error("Address not found");
      // Update fields
      Object.assign(address, updatedData);
      await user.save();

      return {
        success: true,
        message: "Address updated successfully",
        addresses: user.addresses,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  // remove Address
  async removeAddress(userId: string, addressId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      // Find the index of the address to remove
      const addressIndex = user.addresses.findIndex(
        (addr) => addr._id.toString() === addressId
      );
      if (addressIndex === -1) throw new Error("Address not found");

      // Check if the address being removed is the default address
      const isDefaultRemoved = user.addresses[addressIndex].isDefault;

      // Remove the address
      user.addresses.splice(addressIndex, 1);

      // If the removed address was default and there are remaining addresses
      if (isDefaultRemoved && user.addresses.length > 0) {
        // Find the most recent address to set as default
        const latestAddress = user.addresses.reduce((prev, current) =>
          new Date(prev.createdAt) > new Date(current.createdAt)
            ? prev
            : current
        );

        if (latestAddress) {
          latestAddress.isDefault = true;
        }
      }

      await user.save();

      return {
        success: true,
        message: "Address removed successfully",
        addresses: user.addresses,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //isDefault
  async isDefault(userId: string, addressId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      // Find the address to be set as default
      const address = user.addresses.find(
        (addr) => addr._id.toString() === addressId
      );

      if (!address) throw new Error("Address not found");

      // Set all addresses to `isDefault = false`
      user.addresses.forEach((addr) => (addr.isDefault = false));

      // Set the selected address as default
      address.isDefault = true;

      await user.save();

      return {
        success: true,
        message: "Default address updated successfully",
        addresses: user.addresses,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //get Address
  async getAddressService(userId: string) {
    try {
      const user = await User.findById(userId).select("addresses");
      if (!user) {
        throw new Error("User not found");
      }
      return user.addresses;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //forget password
  async forgetPassword() {}
  //logout
  async logoutUser(res: Response): Promise<void> {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: false, // Prevents client-side access to the cookie
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      domain: "localhost", // Ensure this matches your server's domain
      path: "/",
    });
  }
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
