import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  f_name: string;
  l_name: string;
  email: string;
  phone?: number;
  address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  password: string;
  refreshToken?: string;
  role: string;
  // cart: ICartItem[];
  // wishlist: IWishlistItem[];
  // orders: mongoose.Schema.Types.ObjectId[];
  status: string; // e.g., "active", "inactive", "suspended"
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateRefreshToken(): string;
  isOAuthUser: boolean;
}

const userSchema = new Schema<IUser>({
  f_name: {
    type: String,
    required: function () {
      return !this.isOAuthUser;
    }, // Required only if not an OAuth user
    trim: true,
    lowercase: true,
  },
  l_name: {
    type: String,
    required: function () {
      return !this.isOAuthUser;
    }, // Required only if not an OAuth user
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/,
  },
  password: {
    type: String,
    required: function () {
      return !this.isOAuthUser;
    }, // Required only if not an OAuth user
  },
  isOAuthUser: { type: Boolean, default: false }, // Flag to identify OAuth users
  refreshToken: { type: String, required: false },
  role: { type: String, default: "user" },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
});

// Password hashing before saving the user
// userSchema.pre("save", async function (next) {
//   const user = this as IUser;
//   if (!user.isModified("password")) {
//     return next(); // Skip hashing if the password hasn't been modified
//   }
//   const salt = await bcrypt.genSalt(10); // Generate salt for hashing
//   user.password = await bcrypt.hash(user.password, salt); // Hash the password
//   next(); // Continue saving the user
// });

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUser;
  return await bcrypt.compare(candidatePassword, user.password);
};

// Method to generate authentication token
userSchema.methods.generateAuthToken = function (): string {
  const user = this as IUser;
  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function (): string {
  const user = this as IUser;
  const payload = { id: user._id };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// Create the User model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
