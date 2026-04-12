import asyncHandler from "../utils/asyncHandler.js";
import env from "../config/env.js";
import {
  buildAuthCookieOptions,
  clearAuthCookieOptions,
  createAuthToken,
} from "../utils/authToken.js";
import { loginUser, registerUser } from "../services/authService.js";

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
