import * as meetupRepo from "../repositories/meetupRepository.js";

export const getMeetups = () => meetupRepo.findAllMeetups();

export const getMeetup = async (id) => {
  const meetup = await meetupRepo.findMeetupById(id);
  if (!meetup) throw Object.assign(new Error("Meetup not found."), { status: 404 });
  return meetup;
};

export const createMeetup = (user, body) => {
  return meetupRepo.createMeetup({
    ...body,
    organizer: user._id,
    organizerUsername: user.username,
  });
};

export const updateMeetup = async (id, user, body) => {
  const meetup = await meetupRepo.findMeetupById(id);
  if (!meetup) throw Object.assign(new Error("Meetup not found."), { status: 404 });
  if (String(meetup.organizer) !== String(user._id) && user.role !== "admin") {
    throw Object.assign(new Error("Not authorized."), { status: 403 });
  }
  return meetupRepo.updateMeetup(id, body);
};

export const deleteMeetup = async (id, user) => {
  const meetup = await meetupRepo.findMeetupById(id);
  if (!meetup) throw Object.assign(new Error("Meetup not found."), { status: 404 });
  if (String(meetup.organizer) !== String(user._id) && user.role !== "admin") {
    throw Object.assign(new Error("Not authorized."), { status: 403 });
  }
  return meetupRepo.deleteMeetup(id);
};

export const rsvpToMeetup = async (meetupId, user, action) => {
  const meetup = await meetupRepo.findMeetupById(meetupId);
  if (!meetup) throw Object.assign(new Error("Meetup not found."), { status: 404 });

  if (action === "join") {
    return meetupRepo.addRsvp(meetupId, user._id, user.username);
  } else {
    return meetupRepo.removeRsvp(meetupId, user._id);
  }
};

export const leaveFeedback = async (meetupId, user, rating, comment) => {
  const meetup = await meetupRepo.findMeetupById(meetupId);
  if (!meetup) throw Object.assign(new Error("Meetup not found."), { status: 404 });

  const alreadyLeft = meetup.feedback.some(
    (f) => String(f.user) === String(user._id)
  );
  if (alreadyLeft) {
    throw Object.assign(new Error("You already left feedback for this meetup."), { status: 400 });
  }

  return meetupRepo.addFeedback(meetupId, {
    user: user._id,
    username: user.username,
    rating,
    comment,
  });
};
