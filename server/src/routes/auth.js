import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadAvatar } from "../middleware/upload.js";

const router = Router();

// uploadAvatar runs first — parses the multipart form and attaches req.file if an image was sent
router.post("/register", uploadAvatar, register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getCurrentUser);

// Profile update — requires auth, accepts optional new avatar image
router.patch("/profile", requireAuth, uploadAvatar, updateProfile);

export default router;
