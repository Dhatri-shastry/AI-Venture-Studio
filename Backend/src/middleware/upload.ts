import multer from "multer";

/**
 * Single shared multer instance, memory storage (no disk writes - files
 * are processed in-request and never persisted to disk, which is all we
 * need since everything downstream is either extracted-to-text-then-
 * discarded, or sent straight to Gemini as base64).
 *
 * 20MB cap covers pitch decks/reports comfortably without letting someone
 * accidentally (or deliberately) upload something huge.
 */
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
});
