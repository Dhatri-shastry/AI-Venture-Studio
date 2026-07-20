"use client";

import { useState } from "react";
import { Link as LinkIcon, FileText, Loader2 } from "lucide-react";
import { ingestText, ingestFile, ingestUrl } from "@/services/research.service";

interface ResearchPanelProps {
  theme: "light" | "dark";
  activeProjectId: string | null;
}

export default function ResearchPanel({ theme, activeProjectId }: ResearchPanelProps) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const panelBg = theme === "dark" ? "bg-zinc-950 border-zinc-900" : "bg-white border-slate-200";
  const inputCls = theme === "dark"
    ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400";

  if (!activeProjectId) {
    return (
      <div className="flex-1 flex items-center justify-center p-10 text-center">
        <p className={`text-sm ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
          Select a project first - research gets attached to a project's long-term memory.
        </p>
      </div>
    );
  }

  const handleIngestText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      setBusy(true);
      setError(null);
      const result = await ingestText(activeProjectId, text.trim());
      setMessage(`Added ${result.chunksAdded} chunk(s) to this project's memory.`);
      setText("");
    } catch (err) {
      console.error(err);
      setError("Couldn't save that - give it another try?");
    } finally {
      setBusy(false);
    }
  };

  const handleIngestUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setBusy(true);
      setError(null);
      const result = await ingestUrl(activeProjectId, url.trim());
      setMessage(`Pulled in "${result.title}" - ${result.chunksAdded} chunk(s) added.`);
      setUrl("");
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Couldn't reach that URL.");
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      setBusy(true);
      setError(null);
      const result = await ingestFile(activeProjectId, file);
      setMessage(`"${result.filename}" added - ${result.chunksAdded} chunk(s).`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Couldn't process that file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Research</h1>
          <p className={`mt-1 text-sm ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            Feed this project real material - pitch decks, competitor pages, notes - so every chat can draw on it.
          </p>
        </div>

        {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        <form onSubmit={handleIngestText} className={`p-5 rounded-2xl border space-y-3 ${panelBg}`}>
          <label className={`text-xs font-bold uppercase tracking-wide ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            Paste text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Paste notes, a competitor description, pricing info..."
            className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none border resize-none ${inputCls}`}
          />
          <button
            type="submit"
            disabled={busy || !text.trim()}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin inline" /> : "Add to memory"}
          </button>
        </form>

        <form onSubmit={handleIngestUrl} className={`p-5 rounded-2xl border space-y-3 ${panelBg}`}>
          <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            <LinkIcon className="h-3.5 w-3.5" /> Research a URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://competitor.com"
            className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none border ${inputCls}`}
          />
          <button
            type="submit"
            disabled={busy || !url.trim()}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
          >
            Fetch & add
          </button>
        </form>

        <div className={`p-5 rounded-2xl border ${panelBg}`}>
          <label className={`text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 mb-3 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            <FileText className="h-3.5 w-3.5" /> Upload a document
          </label>
          <input
            type="file"
            onChange={handleFile}
            accept=".pdf,.docx,.pptx,.txt,.md,.csv"
            disabled={busy}
            className={`text-sm ${theme === "dark" ? "text-zinc-300" : "text-slate-700"}`}
          />
          <p className={`mt-2 text-xs ${theme === "dark" ? "text-zinc-600" : "text-slate-400"}`}>
            PDF, DOCX, PPTX, TXT, MD, or CSV
          </p>
        </div>
      </div>
    </div>
  );
}