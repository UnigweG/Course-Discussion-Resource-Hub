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
