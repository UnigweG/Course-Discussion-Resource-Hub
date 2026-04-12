import User from "../models/User.js";

// Fields safe to send to the frontend — never include passwordHash
const safeUserProjection = "username email role status avatar lastLoginAt createdAt updatedAt";

export const findUserByEmail = async (email) =>
  User.findOne({ email: email.toLowerCase() });

export const findUserByUsername = async (username) =>
  User.findOne({ username: username.trim() });

export const findUserById = async (userId) => User.findById(userId);

export const findSafeUserById = async (userId) =>
  User.findById(userId).select(safeUserProjection);

export const createUser = async (userData) => User.create(userData);

export const updateLastLoginAt = async (userId) =>
  User.findByIdAndUpdate(
    userId,
    { lastLoginAt: new Date() },
    { new: true },
  ).select(safeUserProjection);

// Update username and/or avatar for a user
export const updateUserProfile = async (userId, updates) =>
  User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select(safeUserProjection);
