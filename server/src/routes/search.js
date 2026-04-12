import { Router } from "express";
import { search } from "../controllers/discussionController.js";

const router = Router();

// GET /api/search?q=keyword
// Queries the discussions collection in MongoDB — no login required
router.get("/", search);

export default router;
