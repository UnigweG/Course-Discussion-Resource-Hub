import AppError from "../utils/AppError.js";
import {
  createComment,
  deleteComment,
  getCommentById,
  getCommentsByDiscussion,
} from "../repositories/commentRepository.js";
import { getDiscussionById } from "../repositories/discussionRepository.js";

export const fetchComments = async (discussionId) => {
  // make sure the discussion exists before fetching comments
  const discussion = await getDiscussionById(discussionId);
  if (!discussion) throw new AppError("Discussion not found.", 404);
  return getCommentsByDiscussion(discussionId);
};

export const addComment = async (discussionId, body, user) => {
  if (!body || !body.trim()) throw new AppError("Comment body is required.", 400);

  const discussion = await getDiscussionById(discussionId);
  if (!discussion) throw new AppError("Discussion not found.", 404);

  return createComment({
    body: body.trim(),
    discussion: discussionId,
    author: user._id,
    authorUsername: user.username,
  });
};

export const removeComment = async (commentId, user) => {
  const comment = await getCommentById(commentId);
  if (!comment) throw new AppError("Comment not found.", 404);

  // only the author or an admin can delete a comment
  const isOwner = comment.author.toString() === user._id.toString();
  const isAdmin = user.role === "admin";
  if (!isOwner && !isAdmin) {
    throw new AppError("You are not allowed to delete this comment.", 403);
  }

  return deleteComment(commentId);
};
