import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res
      .status(400)
      .json({ success: false, message: "Title and body are required" });
  }

  res.json({
    success: true,
    message: "Discussion submitted successfully",
    data: { title, body },
  });
});

export default router;
