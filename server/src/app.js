import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import env from "./config/env.js";
import authRouter from "./routes/auth.js";
import healthRouter from "./routes/health.js";
import searchRouter from "./routes/search.js";
import discussionsRouter from "./routes/discussions.js";
import adminRouter from "./routes/admin.js";
import meetupsRouter from "./routes/meetups.js";

// __dirname is not available in ES modules — derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --------------- Middleware ---------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(cookieParser(env.cookieSecret));
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Serve uploaded avatar images as static files at /uploads/<filename>
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// --------------- Routes ---------------
app.use("/api/auth", authRouter);
app.use("/api", healthRouter);
app.use("/api/search", searchRouter);
app.use("/api/discussions", discussionsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/meetups", meetupsRouter);

// --------------- 404 handler ---------------
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// --------------- Error handler ---------------
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: env.nodeEnv === "development" ? err.message : "Internal server error",
  });
});

export default app;
