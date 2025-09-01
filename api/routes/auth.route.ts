import express from "express";
import {
  signup,
  sendOTP,
  signin,
} from "../controllers/auth.controller"; // keep `.js` in imports when using ES modules

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/send-otp", sendOTP);
router.post("/signin", signin);

export default router;
