import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { startResearch } from "../controllers/research.controller";

const router = Router();

router.post("/", authenticate, startResearch);

export default router;
