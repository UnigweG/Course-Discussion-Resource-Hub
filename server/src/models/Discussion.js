import mongoose from "mongoose";

// Schema for a discussion post — each one belongs to a course category
const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    // course code or name e.g. "COSC 360"
    course: {
      type: String,
      required: true,
      trim: true,
    },
    // store the author's username for easy display
    authorUsername: {
      type: String,
      required: true,
    },
    // reference to the User document
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster search on title and course
discussionSchema.index({ title: "text", body: "text", course: "text" });

const Discussion = mongoose.model("Discussion", discussionSchema);

export default Discussion;
