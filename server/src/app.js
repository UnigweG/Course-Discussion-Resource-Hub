import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import env from "./config/env.js";
import authRouter from "./routes/auth.js";
import healthRouter from "./routes/health.js";
import searchRouter from "./routes/search.js";
import discussionsRouter from "./routes/discussions.js";

const app = express();

// --------------- Middleware ---------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(cookieParser(env.cookieSecret));
if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// --------------- Routes ---------------
app.use("/api/auth", authRouter);
app.use("/api", healthRouter);
app.use("/api/search", searchRouter);
app.use("/api/discussions", discussionsRouter);

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
