import asyncHandler from "../utils/asyncHandler.js";
import env from "../config/env.js";
import Discussion from "../models/Discussion.js";
import Comment from "../models/Comment.js";
import Resource from "../models/Resource.js";
import {
  buildAuthCookieOptions,
  clearAuthCookieOptions,
  createAuthToken,
} from "../utils/authToken.js";
import { loginUser, registerUser, updateProfile as updateProfileService } from "../services/authService.js";

const respondWithAuth = (res, statusCode, user, message) => {
  const token = createAuthToken(user);

  res.cookie(env.authCookieName, token, buildAuthCookieOptions());
  res.status(statusCode).json({
    success: true,
    message,
    data: {
      user,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  // req.file is set by multer if the user uploaded an avatar
  // we store just the filename so we can serve it via /uploads/:filename
  const avatarPath = req.file ? req.file.filename : null;
  const user = await registerUser({ ...req.body, avatarPath });
  respondWithAuth(res, 201, user, "Account created successfully.");
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  respondWithAuth(res, 200, user, "Login successful.");
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(env.authCookieName, clearAuthCookieOptions());
  res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.currentUser,
    },
  });
});

export const getUserActivity = asyncHandler(async (req, res) => {
  const userId = req.currentUser._id;
  const [discussions, comments, resources] = await Promise.all([
    Discussion.find({ author: userId }).sort({ createdAt: -1 }).limit(10).select("title course createdAt"),
    Comment.find({ author: userId }).sort({ createdAt: -1 }).limit(10).select("body discussion createdAt"),
    Resource.find({ author: userId }).sort({ createdAt: -1 }).limit(10).select("title course type createdAt"),
  ]);

  res.json({
    success: true,
    data: {
      counts: {
        discussions: await Discussion.countDocuments({ author: userId }),
        comments: await Comment.countDocuments({ author: userId }),
        resources: await Resource.countDocuments({ author: userId }),
      },
      recent: { discussions, comments, resources },
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  // req.file is set by multer if a new avatar was uploaded
  const avatarPath = req.file ? req.file.filename : null;
  const user = await updateProfileService(req.currentUser._id, { ...req.body, avatarPath });
  res.json({ success: true, message: "Profile updated.", data: { user } });
});
