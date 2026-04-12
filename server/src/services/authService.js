import bcrypt from "bcryptjs";
import {
  createUser,
  findSafeUserById,
  findUserByEmail,
  findUserByUsername,
  updateLastLoginAt,
  updateUserProfile,
} from "../repositories/userRepository.js";
import AppError from "../utils/AppError.js";
import {
  validateLoginPayload,
  validateRegisterPayload,
} from "../validators/authValidators.js";

const SALT_ROUNDS = 10;

export const registerUser = async (payload) => {
  const { username, email, password } = validateRegisterPayload(payload);

  const [existingEmail, existingUsername] = await Promise.all([
    findUserByEmail(email),
    findUserByUsername(username),
  ]);

  if (existingEmail) {
    throw new AppError("An account with that email already exists.", 409);
  }

  if (existingUsername) {
    throw new AppError("That username is already taken.", 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // avatarPath comes from multer — it's the filename saved in /uploads, or null if no file uploaded
  const avatarPath = payload.avatarPath || null;

  const user = await createUser({
    username,
    email,
    passwordHash,
    avatar: avatarPath,
  });

  return findSafeUserById(user.id);
};

export const loginUser = async (payload) => {
  const { email, password } = validateLoginPayload(payload);
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.status !== "active") {
    throw new AppError("Your account has been disabled.", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  return updateLastLoginAt(user.id);
};

export const updateProfile = async (userId, payload) => {
  const updates = {};

  if (payload.username) {
    const trimmed = payload.username.trim();
    if (trimmed.length < 3) throw new AppError("Username must be at least 3 characters.", 400);
    // make sure the new username isn't already taken
    const existing = await findUserByUsername(trimmed);
    if (existing && existing._id.toString() !== userId.toString()) {
      throw new AppError("That username is already taken.", 409);
    }
    updates.username = trimmed;
  }

  if (payload.avatarPath) {
    updates.avatar = payload.avatarPath;
  }

  return updateUserProfile(userId, updates);
};
