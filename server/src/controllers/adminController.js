import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import Discussion from "../models/Discussion.js";
import Comment from "../models/Comment.js";

// GET /api/admin/users?q=searchterm
// Returns all users, optionally filtered by username or email
export const getUsers = asyncHandler(async (req, res) => {
  const query = req.query.q || "";
  const filter = query
    ? { $or: [{ username: new RegExp(query, "i") }, { email: new RegExp(query, "i") }] }
    : {};

  const users = await User.find(filter)
    .select("username email role status avatar createdAt lastLoginAt")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: users });
});

// PATCH /api/admin/users/:id/status
// Toggle a user's status between active and disabled
export const setUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["active", "disabled"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be active or disabled." });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).select("username email role status");

  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  res.json({ success: true, message: `User ${status}.`, data: user });
});

// GET /api/admin/discussions
// Returns all discussions for moderation view
export const getAllDiscussionsAdmin = asyncHandler(async (_req, res) => {
  const discussions = await Discussion.find().sort({ createdAt: -1 });
  res.json({ success: true, data: discussions });
});

// DELETE /api/admin/discussions/:id
// Admin can delete any discussion (and its comments)
export const deleteDiscussionAdmin = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findByIdAndDelete(req.params.id);
  if (!discussion) return res.status(404).json({ success: false, message: "Discussion not found." });

  // clean up all comments belonging to this discussion
  await Comment.deleteMany({ discussion: req.params.id });

  res.json({ success: true, message: "Discussion and its comments deleted." });
});

// GET /api/admin/stats
// Quick platform stats for the dashboard cards
export const getStats = asyncHandler(async (_req, res) => {
  const [totalUsers, totalDiscussions, totalComments] = await Promise.all([
    User.countDocuments(),
    Discussion.countDocuments(),
    Comment.countDocuments(),
  ]);

  res.json({ success: true, data: { totalUsers, totalDiscussions, totalComments } });
});
