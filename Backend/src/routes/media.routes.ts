import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { transcribeAudio, analyzeImage, extractDocument } from "../controllers/media.controller";

const router = Router();

router.post("/transcribe", authenticate, upload.single("audio"), transcribeAudio);
router.post("/image", authenticate, upload.single("image"), analyzeImage);
router.post("/document", authenticate, upload.single("document"), extractDocument);

export default router;
