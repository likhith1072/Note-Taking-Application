import mongoose, { Document, Model, Schema } from "mongoose";

// Define the TypeScript interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  dob: string;
  verifyOtp: string;
  verifyOtpExpireAt: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Create the schema with strong typing
const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dob: {
      type: String,
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 3. Export the model with proper type support
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
