import { Request, Response } from "express";
import { LLMRouter } from "../llm/router";
import { extractTextFromFile, SUPPORTED_EXTENSIONS } from "../rag/extract";
import { loadTextIntoRAG } from "../rag/loader";

interface FileRequest extends Request {
    file?: Express.Multer.File;
}

const router = new LLMRouter();

/**
 * Voice-to-text: the backend for the mic/recorder icon. The frontend
 * records audio (webm/mp3/wav/etc), uploads the blob here, and gets back
 * plain text - either to populate the chat input for the founder to
 * review before sending, or to pass straight through to /api/chat as
 * the message itself.
 */
export const transcribeAudio = async (req: FileRequest, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "No audio file uploaded" });
        }

        const text = await router.transcribeAudio(file.buffer.toString("base64"), file.mimetype);

        if (!text) {
            return res.status(422).json({
                success: false,
                message: "Couldn't make out any speech in that recording - try again a bit closer to the mic.",
            });
        }

        res.json({ success: true, text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Photo/image upload: the backend for the image icon. Produces a text
 * description of the image (OCR'd text, chart/diagram contents, product
 * details, etc) that gets folded into the conversation as attachment
 * context, so the rest of the pipeline never has to handle raw image
 * bytes. If projectId is provided, the description is also stored in
 * that project's long-term memory (RAG) for future reference.
 */
export const analyzeImage = async (req: FileRequest, res: Response) => {
    try {
        const file = req.file;
        const { focus, projectId } = req.body;

        if (!file) {
            return res.status(400).json({ success: false, message: "No image file uploaded" });
        }

        const description = await router.describeImage(file.buffer.toString("base64"), file.mimetype, focus);

        if (projectId) {
            await loadTextIntoRAG(projectId, file.originalname || "uploaded-image", description).catch((err) =>
                console.error("analyzeImage: failed to persist description to RAG (non-fatal)", err)
            );
        }

        res.json({ success: true, description });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Document upload at the chat level (as opposed to research.controller's
 * uploadDocument, which is project-scoped RAG ingestion). This is for
 * "here's a file, use it for THIS message" - it extracts text and
 * returns it for the client to pass as attachmentContext on the next
 * /api/chat call. If projectId is provided, it's also persisted to RAG
 * so it's available on future messages too, not just this one.
 */
export const extractDocument = async (req: FileRequest, res: Response) => {
    try {
        const file = req.file;
        const { projectId } = req.body;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: `No file uploaded. Supported types: ${SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(", ")}`,
            });
        }

        const text = await extractTextFromFile(file.buffer, file.originalname);

        if (projectId) {
            await loadTextIntoRAG(projectId, file.originalname, text).catch((err) =>
                console.error("extractDocument: failed to persist to RAG (non-fatal)", err)
            );
        }

        res.json({ success: true, filename: file.originalname, text });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to process the uploaded file",
        });
    }
};
