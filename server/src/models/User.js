import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    // path to the uploaded avatar image, null if not set
    avatar: {
      type: String,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// unique: true on the fields above already creates these indexes — no need to repeat them

const User = mongoose.model("User", userSchema);

export default User;
