import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IAdmin extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  username: string;
  email: string;
  phone?: number;
  password: string;
  refreshToken?: string;
  role: string;
}

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
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
  phone: {
    type: Number,
    required: false,
    unique: false,
    validate: {
      validator: function (v: number) {
        return /^(?:(?:\+91|91|0)?[789]\d{9})$/.test(String(v));
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid Indian phone number!`,
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "admin",
  },
});

// Hash the password before saving the user model
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const admin = this as IAdmin;
  return await bcrypt.compare(candidatePassword, admin.password);
};

// Method to generate authentication token
adminSchema.methods.generateAuthToken = function (): string {
  const admin = this as IAdmin;
  const payload = { id: admin._id, role: admin.role };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

// Create the User model
const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
