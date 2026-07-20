import { Request, Response } from "express";
import { loadTextIntoRAG } from "../rag/loader";
import { extractTextFromFile, SUPPORTED_EXTENSIONS } from "../rag/extract";
import { scrapeUrl } from "../rag/scrape";
import Document from "../models/Document";

interface FileRequest extends Request {
    file?: Express.Multer.File;
}

/**
 * Ingests research material pasted directly as text into the project's
 * vector store so agents can retrieve it as context later.
 */
export const startResearch = async (req: Request, res: Response) => {
    try {
        const { projectId, source, text } = req.body;

        if (!projectId || !text) {
            return res.status(400).json({
                success: false,
                message: "projectId and text are required",
            });
        }

        const result = await loadTextIntoRAG(projectId, source || "manual-input", text);

        res.json({ success: true, ...result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

/**
 * Handles an uploaded document (PDF/DOCX/PPTX/TXT/MD/CSV) - the backend
 * for the frontend's file/attachment upload icon when used in a research
 * context. Extracts text, chunks + embeds it, and stores it in the
 * project's vector store so every future question in this project can
 * draw on it.
 */
export const uploadDocument = async (req: FileRequest, res: Response) => {
    try {
        const { projectId } = req.body;
        const file = req.file;

        if (!projectId) {
            return res.status(400).json({ success: false, message: "projectId is required" });
        }

        if (!file) {
            return res.status(400).json({
                success: false,
                message: `No file uploaded. Supported types: ${SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(", ")}`,
            });
        }

        const text = await extractTextFromFile(file.buffer, file.originalname);
        const result = await loadTextIntoRAG(projectId, file.originalname, text);

        res.json({
            success: true,
            filename: file.originalname,
            preview: text.slice(0, 300),
            ...result,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to process the uploaded file",
        });
    }
};

/**
 * Scrapes a URL and ingests its readable text into the project's vector
 * store - the backend for "research this competitor's website" style
 * requests.
 */
export const researchUrl = async (req: Request, res: Response) => {
    try {
        const { projectId, url } = req.body;

        if (!projectId || !url) {
            return res.status(400).json({ success: false, message: "projectId and url are required" });
        }

        const { title, text } = await scrapeUrl(url);
        const result = await loadTextIntoRAG(projectId, url, text);

        res.json({ success: true, title, preview: text.slice(0, 300), ...result });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to scrape the URL",
        });
    }
};

/**
 * Lists everything that's been ingested into a project's memory - the
 * backend for the Documents tab. One entry per ingestion call (pasted
 * text, uploaded file, scraped URL), latest first.
 */
export const listDocuments = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ success: false, message: "projectId query param is required" });
        }

        const documents = await Document.find({ projectId }).sort({ createdAt: -1 });

        res.json({ success: true, documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
