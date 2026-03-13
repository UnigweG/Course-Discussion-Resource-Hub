import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import env from "./config/env.js";
import healthRouter from "./routes/health.js";

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
app.use("/api", healthRouter);

export default app;
