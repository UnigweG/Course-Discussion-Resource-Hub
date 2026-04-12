import Discussion from "../models/Discussion.js";

// Get all discussions, newest first
export const getAllDiscussions = async () =>
  Discussion.find().sort({ createdAt: -1 });

// Get a single discussion by its MongoDB id
export const getDiscussionById = async (id) => Discussion.findById(id);

// Insert a new discussion document
export const createDiscussion = async (data) => Discussion.create(data);

// Update title, body, or course on an existing discussion
export const updateDiscussion = async (id, updates) =>
  Discussion.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

// Remove a discussion permanently
export const deleteDiscussion = async (id) =>
  Discussion.findByIdAndDelete(id);

// Search discussions by keyword — checks title, body, and course with regex
export const searchDiscussions = async (query) => {
  const regex = new RegExp(query, "i"); // case-insensitive partial match
  return Discussion.find({
    $or: [
      { title: regex },
      { body: regex },
      { course: regex },
    ],
  }).sort({ createdAt: -1 });
};
