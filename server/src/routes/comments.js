import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createComment, deleteComment, getComments } from "../controllers/commentController.js";

// mergeParams lets us access :discussionId from the parent router
const router = Router({ mergeParams: true });

// Public — anyone can read comments
router.get("/", getComments);

// Protected — must be logged in to comment or delete
router.post("/", requireAuth, createComment);
router.delete("/:commentId", requireAuth, deleteComment);

export default router;
