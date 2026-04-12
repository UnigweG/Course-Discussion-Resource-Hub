import { Router } from "express";
import { searchAll } from "../controllers/searchController.js";

const router = Router();

// GET /api/search?q=keyword
// Searches discussions, resources, and meetups. No login required.
router.get("/", searchAll);

export default router;
