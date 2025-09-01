import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/error";
import Note from "../models/note.model";
import { Types } from "mongoose";

// Extend Express Request to include user object from auth middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, content } = req.body;
  const userId: string = req.user!.id || "";

  if (!title || !content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const newNote = new Note({
    title,
    content,
    userId: new Types.ObjectId(userId), // convert string → ObjectId
  });

  try {
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
};

export const getnote = async (req: AuthRequest, res: Response, next: NextFunction) => {
     const { noteId } = req.params;
      
       const userId: string = req.user!.id || "";

  try {
    const note = await Note.findById(noteId);
    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }
       if (userId !== String(note.userId)) {
      return next(errorHandler(403, "You are not allowed to access this note"));
    }
    res.status(200).json({ note });
  } catch (error) {
    next(error);
  }
};

export const getnotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId: string = req.user!.id || "";

  try {
    const notes = await Note.find({ userId: new Types.ObjectId(userId) }).sort({ updatedAt: -1 });
    res.status(200).json({ notes });
  } catch (error) {
    next(error);
  }
};

export const deletenote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { noteId } = req.params;
   const userId: string = req.user!.id || "";

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }

    if (userId !== String(note.userId)) {
      return next(errorHandler(403, "You are not allowed to delete this note"));
    }

    await Note.findByIdAndDelete(noteId);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updatenote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { noteId } = req.params;
  const { title, content } = req.body;
    const userId: string = req.user!.id || "";

  try {
    const note = await Note.findById(noteId);

    if (!note) {
      return next(errorHandler(404, "Note not found"));
    }

    if (userId !== String(note.userId)) {
      return next(errorHandler(403, "You are not allowed to update this note"));
    }

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $set: { title, content } },
      { new: true }
    );

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
