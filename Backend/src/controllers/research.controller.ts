import { Request, Response } from "express";
import { loadTextIntoRAG } from "../rag/loader";

/**
 * Ingests research material (pasted text, notes, scraped content) into
 * the project's vector store so agents can retrieve it as context later.
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
