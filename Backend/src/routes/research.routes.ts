import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { startResearch, uploadDocument, researchUrl, listDocuments } from "../controllers/research.controller";

const router = Router();

router.post("/", authenticate, startResearch);
router.post("/upload", authenticate, upload.single("file"), uploadDocument);
router.post("/url", authenticate, researchUrl);
router.get("/documents", authenticate, listDocuments);

export default router;
