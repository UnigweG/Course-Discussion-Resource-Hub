import AppError from "../utils/AppError.js";

const normalizeString = (value) => (typeof value === "string" ? value.trim() : "");

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const validateRegisterPayload = (payload = {}) => {
  const username = normalizeString(payload.username);
  const email = normalizeString(payload.email).toLowerCase();
  const password = typeof payload.password === "string" ? payload.password : "";

  if (username.length < 3) {
    throw new AppError("Username must be at least 3 characters long.", 400);
  }

  if (!validateEmail(email)) {
    throw new AppError("Please provide a valid email address.", 400);
  }

  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters long.", 400);
  }

  return { username, email, password };
};

export const validateLoginPayload = (payload = {}) => {
  const email = normalizeString(payload.email).toLowerCase();
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!validateEmail(email) || password.length === 0) {
    throw new AppError("Email and password are required.", 400);
  }

  return { email, password };
};
