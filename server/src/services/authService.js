import bcrypt from "bcryptjs";
import {
  createUser,
  findSafeUserById,
  findUserByEmail,
  findUserByUsername,
  updateLastLoginAt,
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
  const user = await createUser({
    username,
    email,
    passwordHash,
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
