import express from "express";
import {
  signup,
  sendOTP,
  signin,
  google,
  signout
} from "../controllers/auth.controller"; // keep `.js` in imports when using ES modules

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/send-otp", sendOTP);
router.post("/signin", signin);
router.post('/google',google);
router.post('/signout',signout)

export default router;
