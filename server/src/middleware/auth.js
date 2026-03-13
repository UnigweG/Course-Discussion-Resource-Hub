import env from "../config/env.js";
import { findSafeUserById } from "../repositories/userRepository.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAuthToken } from "../utils/authToken.js";

const getSignedToken = (req) => req.signedCookies?.[env.authCookieName];

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = getSignedToken(req);

  if (!token) {
    throw new AppError("Authentication required.", 401);
  }

  const payload = verifyAuthToken(token);
  const user = await findSafeUserById(payload.userId);

  if (!user || user.status !== "active") {
    throw new AppError("Your account is unavailable.", 401);
  }

  req.auth = {
    userId: payload.userId,
    role: payload.role,
  };
  req.currentUser = user;

  next();
});

export const requireRole = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.auth) {
      throw new AppError("Authentication required.", 401);
    }

    if (!roles.includes(req.auth.role)) {
      throw new AppError("You do not have permission to access this resource.", 403);
    }

    next();
  });
