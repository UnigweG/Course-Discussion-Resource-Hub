import jwt from "jsonwebtoken";
import env from "../config/env.js";
import AppError from "./AppError.js";

const authCookieBase = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.nodeEnv === "production",
  signed: true,
};

export const createAuthToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

export const verifyAuthToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (_error) {
    throw new AppError("Invalid or expired session.", 401);
  }
};

export const buildAuthCookieOptions = () => ({
  ...authCookieBase,
  maxAge: env.authCookieMaxAgeDays * 24 * 60 * 60 * 1000,
});

export const clearAuthCookieOptions = () => authCookieBase;
