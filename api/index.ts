import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route"; // remove `.ts` when importing
import cors from "cors";
import cookieParser from "cookie-parser";
import noteRoutes from "./routes/note.route"; 
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO as string).then(()=>{console.log('Connected to mongoDB');}).catch((err)=>{console.log(err);}); 

const __dirnamee = path.resolve(); 
const app=express();
const origin = process.env.NODE_ENV === 'production'
  ? 'FrontendWebsiteLink'
  : 'http://localhost:5173';

app.use(
  cors({
    origin: origin,
    credentials: true, // allows cookies/headers
  })
);

app.use(express.json());
app.use(cookieParser());

const port = Number(process.env.PORT) || 3000;



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/note", noteRoutes);


app.use(express.static(path.join(__dirnamee, '/client/dist')));

app.get('/*splat', (req, res) => { 
  res.sendFile(path.join(__dirnamee, 'client','dist','index.html'));
});

// Global error handler
app.use(
  (
    err: { statusCode?: number; message?: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
);
