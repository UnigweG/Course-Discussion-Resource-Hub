import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../models/User.js";

// Seed a small set of accounts so TAs / teammates can log in and exercise the site
const SEED_USERS = [
  {
    username: "admin",
    email: "admin@university.edu",
    password: "Admin123!",
    role: "admin",
  },
  {
    username: "jeet",
    email: "jeet@university.edu",
    password: "Student123!",
    role: "user",
  },
  {
    username: "gabriel",
    email: "gabriel@university.edu",
    password: "Student123!",
    role: "user",
  },
  {
    username: "demo_student",
    email: "demo@university.edu",
    password: "password123",
    role: "user",
  },
];

export const seedSampleUser = async () => {
  const count = await User.countDocuments();
  if (count > 0) {
    console.log(`Seed skipped — ${count} user(s) already exist`);
    return;
  }

  for (const u of SEED_USERS) {
    await User.create({
      username: u.username,
      email: u.email,
      passwordHash: await bcrypt.hash(u.password, 10),
      role: u.role,
    });
  }

  console.log(`Seed complete — inserted ${SEED_USERS.length} users into 'users' collection`);
};

// Run standalone: npm run seed --workspace server
const isMain = process.argv[1]?.includes("sampleUser");
if (isMain) {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Connected to MongoDB for seeding");
    await seedSampleUser();
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}
