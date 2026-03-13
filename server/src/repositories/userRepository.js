import User from "../models/User.js";

const safeUserProjection = "username email role status lastLoginAt createdAt updatedAt";

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
