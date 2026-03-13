import dotenv from "dotenv";
dotenv.config();

const env = Object.freeze({
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/course-hub",
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "change-me-before-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  cookieSecret: process.env.COOKIE_SECRET || "change-me-too",
});

export default env;
