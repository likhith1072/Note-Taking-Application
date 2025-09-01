import express from "express";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route"; // remove `.ts` when importing
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.connect(process.env.MONGO as string).then(()=>{console.log('Connected to mongoDB');}).catch((err)=>{console.log(err);}); 


const app = express();

// Example: dynamic origin setup (uncomment if you want per-env origins)
// const origin = process.env.NODE_ENV === "production"
//   ? "https://blogging-platform-with-dashboard.onrender.com"
//   : "http://localhost:5173";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allows cookies/headers
  })
);

app.use(express.json());
app.use(cookieParser());

const port = Number(process.env.PORT) || 3000;

// Connect to MongoDB (optional error handling)
mongoose
  .connect(process.env.MONGO as string)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Routes
app.use("/api/auth", authRoutes);

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
