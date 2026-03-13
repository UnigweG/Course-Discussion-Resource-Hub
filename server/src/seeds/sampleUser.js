import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../models/User.js";

export const seedSampleUser = async () => {
  const count = await User.countDocuments();
  if (count > 0) {
    console.log(`Seed skipped — ${count} user(s) already exist`);
    return;
  }

  await User.create({
    username: "demo_student",
    email: "demo@university.edu",
    passwordHash: await bcrypt.hash("password123", 10),
  });

  console.log("Seed complete — sample user inserted into 'users' collection");
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
