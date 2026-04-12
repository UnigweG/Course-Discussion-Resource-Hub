import Meetup from "../models/Meetup.js";

export const findAllMeetups = () =>
  Meetup.find().sort({ date: 1 });

export const findMeetupById = (id) =>
  Meetup.findById(id);

export const createMeetup = (data) =>
  Meetup.create(data);

export const updateMeetup = (id, data) =>
  Meetup.findByIdAndUpdate(id, data, { new: true });

export const deleteMeetup = (id) =>
  Meetup.findByIdAndDelete(id);

export const addRsvp = (meetupId, userId, username) =>
  Meetup.findByIdAndUpdate(
    meetupId,
    { $addToSet: { rsvps: { user: userId, username } } },
    { new: true }
  );

export const removeRsvp = (meetupId, userId) =>
  Meetup.findByIdAndUpdate(
    meetupId,
    { $pull: { rsvps: { user: userId } } },
    { new: true }
  );

export const addFeedback = (meetupId, feedbackEntry) =>
  Meetup.findByIdAndUpdate(
    meetupId,
    { $push: { feedback: feedbackEntry } },
    { new: true }
  );
