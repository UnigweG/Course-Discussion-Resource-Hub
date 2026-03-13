import mongoose from "mongoose";
import env from "../config/env.js";
import User from "../models/User.js";

export const seedSampleUser = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      console.log(`Seed skipped — ${count} user(s) already exist`);
      return;
    }

    await User.create({
      username: "demo_student",
      email: "demo@university.edu",
      password: "password123",
    });

    console.log("Seed complete — sample user inserted into 'users' collection");
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
  }
};

// Run standalone: npm run seed --workspace server
const isMain = process.argv[1]?.includes("sampleUser");
if (isMain) {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("Connected to MongoDB for seeding");
    await seedSampleUser();
  } catch (error) {
    console.error(`Failed to connect: ${error.message}`);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}
