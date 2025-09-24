import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.send("Hello World!");
});

router.get("/error", (req, res, next) => {
  next(new Error("This route is not allowed"));
});

export default router;
