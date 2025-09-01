import User from '../models/user.model'
import { errorHandler } from '../utils/error';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer';
import type { Request, Response, NextFunction } from "express";


export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { name, email, dob } = req.body as {
        name: string;
        email: string;
        dob: string;
    };

    // Validate inputs
    if (!name || !email || !dob || name === "" || email === "" || dob === "") {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(errorHandler(409, "User already exists"));
        }

        // Create new user
        const newUser = new User({
            username:name,
            email,
            dob,
        });

        await newUser.save();


        // Send welcome email 
        const mailOptions = {
            from: process.env.SENDER_EMAIL as string,
            to: email,
            subject: "Welcome to Note Taker",
            text: `Hello ${name},\n\nWelcome to Note Taker! Your account has been created with email ID: ${email}.`,
        };

        await transporter.sendMail(mailOptions);

        try {

            // Generate 6-digit OTP
            const otp = String(Math.floor(100000 + Math.random() * 900000));

            newUser.verifyOtp = otp;
            newUser.verifyOtpExpireAt = Date.now() + 60 * 60 * 1000; // 1 hour expiry

            await newUser.save();

            // Send OTP email
            const mailOptions = {
                from: process.env.SENDER_EMAIL as string,
                to: newUser.email,
                subject: "OTP Verification",
                text: `Your OTP for SignUp is ${otp}. It is valid for 1 hour.`,
            };

            await transporter.sendMail(mailOptions);

            res.json({
                success: true,
                message: "OTP sent to your email successfully",
            });
        } catch (error) {
            next(error);
        }



    } catch (error) {
        next(error);
    }
};

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body as { email: string };

  if (!email) {
    res.json({ success: false, message: "Missing email" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.json({ success: false, message: "User not found" });
      return;
    }

    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 60 * 60 * 1000; // 1 hour expiry

    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.SENDER_EMAIL as string,
      to: user.email,
      subject: "OTP Verification",
      text: `Your OTP for SignIn is ${otp}. It is valid for 1 hour.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "OTP sent to your email successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { otp, email, keepMeLoggedIn } = req.body as { otp: string; email: string; keepMeLoggedIn: boolean };

  if (!email || !otp) {
    res.json({ success: false, message: "Missing details" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.json({ success: false, message: "User not found" });
      return;
    }

    if (!user.verifyOtp || user.verifyOtp !== otp) {
      res.json({ success: false, message: "Invalid OTP" });
      return;
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      res.json({ success: false, message: "OTP expired" });
      return;
    }

    // OTP is valid, clear it
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();


    // Create JWT
    const token = jwt.sign(
      { id: user._id, name: user.username, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: keepMeLoggedIn ? "7d" : "1d" }
    );

    // Clean user object
    const userObj = user.toObject();
    userObj.verifyOtp = "";


    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        success: true,
        rest: userObj,
      });
  } catch (error) {
    next(error);
  }
};



export const google = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with provided fields
      user = new User({
        username, // duplicates are allowed in your schema
        email,
      });

      await user.save();
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" } // optional expiry
    );

    // Only return safe fields
    const { _id } = user;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({
        success: true,
        rest: { _id, username: user.username, email: user.email },
      });
  } catch (error) {
    next(error);
  }
};




export const signout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res
      .clearCookie("access_token", {
        httpOnly: true, // protects from XSS
        secure: process.env.NODE_ENV === "production", // only over HTTPS in prod
        sameSite: "strict", // CSRF protection
      })
      .status(200)
      .json({ success: true, message: "User has been signed out" });
  } catch (error) {
    next(error);
  }
};
