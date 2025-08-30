import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// const origin = process.env.NODE_ENV === 'production'
//   ? 'https://blogging-platform-with-dashboard.onrender.com'
//   : 'http://localhost:5173';

app.use(cors({
    origin:'http://localhost:5173',
    credentials: true, // If you plan to send cookies/auth headers
  }));
  app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get("/api", (req, res) => {
  res.json("Hello from Express + TypeScript + ES6!");
});


