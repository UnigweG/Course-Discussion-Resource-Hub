import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  deleteDiscussionAdmin,
  getAllDiscussionsAdmin,
  getStats,
  getUsers,
  setUserStatus,
} from "../controllers/adminController.js";

const router = Router();

// All admin routes require login and the admin role
router.use(requireAuth, requireRole("admin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/status", setUserStatus);
router.get("/discussions", getAllDiscussionsAdmin);
router.delete("/discussions/:id", deleteDiscussionAdmin);

export default router;
