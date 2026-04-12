import asyncHandler from "../utils/asyncHandler.js";
import { addComment, fetchComments, removeComment } from "../services/commentService.js";

// GET /api/discussions/:discussionId/comments
export const getComments = asyncHandler(async (req, res) => {
  const comments = await fetchComments(req.params.discussionId);
  res.json({ success: true, data: comments });
});

// POST /api/discussions/:discussionId/comments
export const createComment = asyncHandler(async (req, res) => {
  const comment = await addComment(
    req.params.discussionId,
    req.body.body,
    req.currentUser
  );
  res.status(201).json({ success: true, data: comment });
});

// DELETE /api/discussions/:discussionId/comments/:commentId
export const deleteComment = asyncHandler(async (req, res) => {
  await removeComment(req.params.commentId, req.currentUser);
  res.json({ success: true, message: "Comment deleted." });
});
