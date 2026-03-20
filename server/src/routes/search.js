import { Router } from "express";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const threadsPath = join(__dirname, "..", "data", "threads.json");

router.get("/", async (req, res) => {
  const query = (req.query.q || "").toLowerCase();

  const raw = await readFile(threadsPath, "utf-8");
  const threads = JSON.parse(raw);

  const results = threads.filter(
    (t) =>
      t.title.toLowerCase().includes(query) ||
      t.course.toLowerCase().includes(query)
  );

  res.json({ success: true, results });
});

export default router;
