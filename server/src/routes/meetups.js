import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getMeetups,
  getMeetup,
  createMeetup,
  updateMeetup,
  deleteMeetup,
  rsvpMeetup,
  submitFeedback,
} from "../controllers/meetupController.js";

const router = Router();

router.get("/", getMeetups);
router.get("/:id", getMeetup);
router.post("/", requireAuth, createMeetup);
router.put("/:id", requireAuth, updateMeetup);
router.delete("/:id", requireAuth, deleteMeetup);
router.post("/:id/rsvp", requireAuth, rsvpMeetup);
router.post("/:id/feedback", requireAuth, submitFeedback);

export default router;
