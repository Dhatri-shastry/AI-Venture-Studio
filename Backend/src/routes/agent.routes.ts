import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { executeAgent } from "../controllers/agent.controller";

const router = Router();

router.post("/", authenticate, executeAgent);

export default router;
