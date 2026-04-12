import mongoose from "mongoose";

const meetupSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizerUsername: {
      type: String,
      required: true,
    },
    rsvps: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
      },
    ],
    feedback: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, maxlength: 500 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Meetup = mongoose.model("Meetup", meetupSchema);
export default Meetup;
