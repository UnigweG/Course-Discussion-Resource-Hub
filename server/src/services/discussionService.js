import AppError from "../utils/AppError.js";
import {
  createDiscussion,
  deleteDiscussion,
  getAllDiscussions,
  getDiscussionById,
  searchDiscussions,
  updateDiscussion,
} from "../repositories/discussionRepository.js";

// Validate that required fields are present and not empty
const validateDiscussionPayload = ({ title, body, course }) => {
  if (!title || !title.trim()) throw new AppError("Title is required.", 400);
  if (!body || !body.trim()) throw new AppError("Body is required.", 400);
  if (!course || !course.trim()) throw new AppError("Course is required.", 400);
};

export const fetchAllDiscussions = async () => getAllDiscussions();

export const fetchDiscussionById = async (id) => {
  const discussion = await getDiscussionById(id);
  if (!discussion) throw new AppError("Discussion not found.", 404);
  return discussion;
};

export const addDiscussion = async (payload, user) => {
  validateDiscussionPayload(payload);
  return createDiscussion({
    title: payload.title.trim(),
    body: payload.body.trim(),
    course: payload.course.trim(),
    author: user._id,
    authorUsername: user.username,
  });
};

export const editDiscussion = async (id, payload, user) => {
  const discussion = await getDiscussionById(id);
  if (!discussion) throw new AppError("Discussion not found.", 404);

  // Only the original author or an admin can edit
  const isOwner = discussion.author.toString() === user._id.toString();
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to edit this discussion.", 403);
  }

  validateDiscussionPayload({
    title: payload.title ?? discussion.title,
    body: payload.body ?? discussion.body,
    course: payload.course ?? discussion.course,
  });

  return updateDiscussion(id, {
    title: payload.title?.trim(),
    body: payload.body?.trim(),
    course: payload.course?.trim(),
  });
};

export const removeDiscussion = async (id, user) => {
  const discussion = await getDiscussionById(id);
  if (!discussion) throw new AppError("Discussion not found.", 404);

  // Only the original author or an admin can delete
  const isOwner = discussion.author.toString() === user._id.toString();
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to delete this discussion.", 403);
  }

  return deleteDiscussion(id);
};

export const searchForDiscussions = async (query) => {
  if (!query || !query.trim()) return [];
  return searchDiscussions(query.trim());
};
