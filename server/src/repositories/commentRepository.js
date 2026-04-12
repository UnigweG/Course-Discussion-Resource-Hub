import Comment from "../models/Comment.js";

// Get all comments for a discussion, oldest first
export const getCommentsByDiscussion = async (discussionId) =>
  Comment.find({ discussion: discussionId }).sort({ createdAt: 1 });

export const getCommentById = async (id) => Comment.findById(id);

export const createComment = async (data) => Comment.create(data);

export const deleteComment = async (id) => Comment.findByIdAndDelete(id);

// Delete all comments when a discussion is deleted
export const deleteCommentsByDiscussion = async (discussionId) =>
  Comment.deleteMany({ discussion: discussionId });
