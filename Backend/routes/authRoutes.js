import express from "express";
import { register, login, getMe,forgotPassword,resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validations/auth.validation.js";
router.post("/login", authLimiter, validate(loginSchema),login);
router.post("/register", authLimiter, validate(registerSchema), register);
router.get("/me", protect, getMe);
router.post("/forgot-password",validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema),resetPassword);

export default router;




 