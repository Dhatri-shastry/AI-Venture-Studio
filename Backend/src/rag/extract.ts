import mammoth from "mammoth";
import JSZip from "jszip";
import { PDFParse } from "pdf-parse";

/**
 * Text extraction for uploaded documents, dispatched by file extension.
 * Every extractor throws a clear, specific error on failure rather than
 * returning garbage - callers (research.controller.ts) turn that into a
 * 400 with a useful message instead of silently ingesting junk into RAG.
 */

async function extractPdf(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
}

async function extractDocx(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
}

/**
 * PPTX is a zip of XML slide files. Rather than pull in a heavy
 * PowerPoint-parsing dependency, this unzips it (a PPTX IS a zip) and
 * pulls text runs (<a:t>...</a:t>) out of each slideN.xml in order -
 * good enough for "what does this pitch deck say", which is all RAG
 * ingestion needs.
 */
async function extractPptx(buffer: Buffer): Promise<string> {
    const zip = await JSZip.loadAsync(buffer);

    const slideFiles = Object.keys(zip.files)
        .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
        .sort((a, b) => {
            const numA = parseInt(a.match(/slide(\d+)\.xml/)?.[1] || "0", 10);
            const numB = parseInt(b.match(/slide(\d+)\.xml/)?.[1] || "0", 10);
            return numA - numB;
        });

    const slideTexts: string[] = [];

    for (const fileName of slideFiles) {
        const xml = await zip.files[fileName].async("text");
        const textRuns = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]);
        slideTexts.push(textRuns.join(" "));
    }

    return slideTexts
        .map((text, i) => `--- Slide ${i + 1} ---\n${text}`)
        .join("\n\n");
}

function extractPlainText(buffer: Buffer): string {
    return buffer.toString("utf-8");
}

const EXTENSION_HANDLERS: Record<string, (buffer: Buffer) => Promise<string>> = {
    pdf: extractPdf,
    docx: extractDocx,
    pptx: extractPptx,
    txt: async (b) => extractPlainText(b),
    md: async (b) => extractPlainText(b),
    csv: async (b) => extractPlainText(b),
};

export const SUPPORTED_EXTENSIONS = Object.keys(EXTENSION_HANDLERS);

function getExtension(filename: string): string {
    return (filename.split(".").pop() || "").toLowerCase();
}

export async function extractTextFromFile(buffer: Buffer, filename: string): Promise<string> {
    const ext = getExtension(filename);
    const handler = EXTENSION_HANDLERS[ext];

    if (!handler) {
        throw new Error(
            `Unsupported file type ".${ext}". Supported: ${SUPPORTED_EXTENSIONS.map((e) => `.${e}`).join(", ")}`
        );
    }

    const text = await handler(buffer);

    if (!text.trim()) {
        throw new Error(`No text could be extracted from "${filename}" - it may be empty, scanned/image-only, or corrupted.`);
    }

    return text;
}
