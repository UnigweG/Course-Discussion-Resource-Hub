import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getResources,
  createResource,
  deleteResource,
  upvoteResource,
} from "../controllers/resourceController.js";

const router = Router();

router.get("/", getResources);
router.post("/", requireAuth, createResource);
router.delete("/:id", requireAuth, deleteResource);
router.post("/:id/upvote", requireAuth, upvoteResource);

export default router;
