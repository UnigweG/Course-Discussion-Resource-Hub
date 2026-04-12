import asyncHandler from "../utils/asyncHandler.js";
import Discussion from "../models/Discussion.js";
import Resource from "../models/Resource.js";
import Meetup from "../models/Meetup.js";

// GET /api/search?q=keyword
// Searches discussions, resources, and meetups. Returns grouped results so
// the client can render them in separate sections.
export const searchAll = asyncHandler(async (req, res) => {
  const raw = (req.query.q || "").trim();
  if (!raw) {
    return res.json({
      success: true,
      results: { discussions: [], resources: [], meetups: [] },
    });
  }

  // Escape any regex metacharacters so a user query like "C++" doesn't blow up
  const safe = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rx = new RegExp(safe, "i");

  const [discussions, resources, meetups] = await Promise.all([
    Discussion.find({
      $or: [{ title: rx }, { body: rx }, { course: rx }],
    })
      .sort({ createdAt: -1 })
      .limit(20),
    Resource.find({
      $or: [{ title: rx }, { description: rx }, { course: rx }],
    })
      .sort({ createdAt: -1 })
      .limit(20),
    Meetup.find({
      $or: [{ title: rx }, { description: rx }, { course: rx }, { location: rx }],
    })
      .sort({ date: -1 })
      .limit(20),
  ]);

  res.json({
    success: true,
    results: { discussions, resources, meetups },
  });
});
