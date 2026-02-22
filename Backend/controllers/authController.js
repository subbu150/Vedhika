import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";



/* =====================================
   Helper
===================================== */

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};



/* =====================================
   REGISTER
===================================== */

export const register = async (req, res) => {
  try {
    const { name, email, password ,role} = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password ,role});

    res.status(201).json({
      token: generateToken(user._id)
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};



/* =====================================
   LOGIN
===================================== */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("in Login Rout",email,password);
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      console.log("I encountered");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    res.json({
      token: generateToken(user._id),
      user
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




/* =====================================
   GET CURRENT USER
===================================== */

export const getMe = async (req, res) => {
  res.json(req.user);
};



/* =====================================
   FORGOT PASSWORD
===================================== */

export const forgotPassword = async (req, res) => {
  try {
    console.log("Forgot password for:", req.body.email);

    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetURL =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    console.log("Reset URL:", resetURL);

    await sendEmail({
      email: user.email,
      subject: "Password Reset - Vedika",
      message: `Reset: ${resetURL}`
    });

    res.json({ message: "Reset email sent successfully" });

  } catch (err) {
    console.error("FORGOT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



/* =====================================
   RESET PASSWORD
===================================== */

export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
