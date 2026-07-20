import express from "express";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get(
  "/me",
  authenticate,
  async (req: any, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

export default router;
