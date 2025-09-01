import mongoose, { Document, Schema, Model } from "mongoose";

// Define the Note interface for TypeScript
export interface INote extends Document {
  userId: mongoose.Types.ObjectId; // reference to User
  content: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define schema
const noteSchema: Schema<INote> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure title is unique per user
noteSchema.index({ userId: 1, title: 1 }, { unique: true });

// Define and export model
const Note: Model<INote> = mongoose.model<INote>("Note", noteSchema);

export default Note;
