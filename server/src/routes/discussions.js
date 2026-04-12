import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  create,
  getAll,
  getHot,
  getOne,
  remove,
  update,
} from "../controllers/discussionController.js";
import commentRouter from "./comments.js";

const router = Router();

// Public routes — anyone can read discussions
router.get("/", getAll);
router.get("/hot", getHot);
router.get("/:id", getOne);

// Protected routes — must be logged in to post, edit, or delete
router.post("/", requireAuth, create);
router.put("/:id", requireAuth, update);
router.delete("/:id", requireAuth, remove);

// Nest comments under discussions: /api/discussions/:discussionId/comments
router.use("/:discussionId/comments", commentRouter);

export default router;
