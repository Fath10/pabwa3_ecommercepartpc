import express from "express";
import {authMiddleware} from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  googleLogin
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, upload.single("avatar"), updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);

export default router;