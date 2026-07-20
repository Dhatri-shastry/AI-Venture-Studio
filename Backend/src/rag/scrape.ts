import * as cheerio from "cheerio";

const MAX_CHARS = 20000;

/**
 * Fetches a URL and extracts its readable text - strips scripts, styles,
 * nav/header/footer chrome, and collapses whitespace. Capped at MAX_CHARS
 * so one giant page doesn't blow the embedding budget for the chunk it
 * gets split into anyway.
 */
export async function scrapeUrl(url: string): Promise<{ title: string; text: string }> {
    let parsed: URL;

    try {
        parsed = new URL(url);
    } catch {
        throw new Error(`"${url}" is not a valid URL`);
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Only http/https URLs are supported");
    }

    const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; AIVentureStudioBot/1.0)" },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${url} (${res.status})`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, nav, header, footer, noscript, svg, iframe").remove();

    const title = $("title").first().text().trim();
    const text = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, MAX_CHARS);

    if (!text) {
        throw new Error(`No readable text found at ${url}`);
    }

    return { title: title || url, text };
}
