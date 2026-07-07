import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createProject, getProjects, getProjectById } from "../controllers/project.controller";

const router = Router();

router.use(authenticate);

router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);

export default router;
