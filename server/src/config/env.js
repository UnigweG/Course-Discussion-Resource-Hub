import dotenv from "dotenv";
dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET", "COOKIE_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const env = Object.freeze({
  mongoUri: process.env.MONGODB_URI,
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  authCookieName: process.env.AUTH_COOKIE_NAME || "course_hub_auth",
  authCookieMaxAgeDays: parseInt(process.env.AUTH_COOKIE_MAX_AGE_DAYS, 10) || 7,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  cookieSecret: process.env.COOKIE_SECRET,
});

export default env;
