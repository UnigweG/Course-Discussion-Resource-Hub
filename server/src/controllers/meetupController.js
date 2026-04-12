import asyncHandler from "../utils/asyncHandler.js";
import * as meetupService from "../services/meetupService.js";

export const getMeetups = asyncHandler(async (_req, res) => {
  const meetups = await meetupService.getMeetups();
  res.json({ success: true, data: meetups });
});

export const getMeetup = asyncHandler(async (req, res) => {
  const meetup = await meetupService.getMeetup(req.params.id);
  res.json({ success: true, data: meetup });
});

export const createMeetup = asyncHandler(async (req, res) => {
  const meetup = await meetupService.createMeetup(req.currentUser, req.body);
  res.status(201).json({ success: true, data: meetup });
});

export const updateMeetup = asyncHandler(async (req, res) => {
  const meetup = await meetupService.updateMeetup(req.params.id, req.currentUser, req.body);
  res.json({ success: true, data: meetup });
});

export const deleteMeetup = asyncHandler(async (req, res) => {
  await meetupService.deleteMeetup(req.params.id, req.currentUser);
  res.json({ success: true, message: "Meetup deleted." });
});

export const rsvpMeetup = asyncHandler(async (req, res) => {
  const { action } = req.body;
  if (!["join", "leave"].includes(action)) {
    return res.status(400).json({ success: false, message: "Action must be join or leave." });
  }
  const meetup = await meetupService.rsvpToMeetup(req.params.id, req.currentUser, action);
  res.json({ success: true, data: meetup });
});

export const submitFeedback = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
  }
  const meetup = await meetupService.leaveFeedback(req.params.id, req.currentUser, rating, comment);
  res.json({ success: true, data: meetup });
});
