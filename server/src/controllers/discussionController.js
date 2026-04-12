import asyncHandler from "../utils/asyncHandler.js";
import {
  addDiscussion,
  editDiscussion,
  fetchAllDiscussions,
  fetchDiscussionById,
  removeDiscussion,
  searchForDiscussions,
} from "../services/discussionService.js";
import Comment from "../models/Comment.js";
import Discussion from "../models/Discussion.js";

// GET /api/discussions — return all discussions
export const getAll = asyncHandler(async (_req, res) => {
  const discussions = await fetchAllDiscussions();
  res.json({ success: true, data: discussions });
});

// GET /api/discussions/:id — return a single discussion
export const getOne = asyncHandler(async (req, res) => {
  const discussion = await fetchDiscussionById(req.params.id);
  res.json({ success: true, data: discussion });
});

// POST /api/discussions — create a new discussion (auth required)
export const create = asyncHandler(async (req, res) => {
  const discussion = await addDiscussion(req.body, req.currentUser);
  res.status(201).json({
    success: true,
    message: "Discussion posted successfully!",
    data: discussion,
  });
});

// PUT /api/discussions/:id — edit an existing discussion
export const update = asyncHandler(async (req, res) => {
  const discussion = await editDiscussion(req.params.id, req.body, req.currentUser);
  res.json({ success: true, message: "Discussion updated.", data: discussion });
});

// DELETE /api/discussions/:id — remove a discussion
export const remove = asyncHandler(async (req, res) => {
  await removeDiscussion(req.params.id, req.currentUser);
  res.json({ success: true, message: "Discussion deleted." });
});

// GET /api/discussions/search?q= — search discussions in the DB
export const search = asyncHandler(async (req, res) => {
  const results = await searchForDiscussions(req.query.q || "");
  res.json({ success: true, results });
});

// GET /api/discussions/hot — top 5 discussions by comment count in last 7 days
export const getHot = asyncHandler(async (_req, res) => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const counts = await Comment.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: "$discussion", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const ids = counts.map((c) => c._id);
  const discussions = await Discussion.find({ _id: { $in: ids } }).select("title course authorUsername createdAt");

  const withCount = discussions.map((d) => {
    const found = counts.find((c) => String(c._id) === String(d._id));
    return { ...d.toObject(), commentCount: found ? found.count : 0 };
  }).sort((a, b) => b.commentCount - a.commentCount);

  res.json({ success: true, data: withCount });
});
