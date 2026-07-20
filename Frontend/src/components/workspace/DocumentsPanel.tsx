"use client";

import { useEffect, useState } from "react";
import { FileText, Link as LinkIcon, Type } from "lucide-react";
import { listDocuments, DocumentEntry } from "@/services/research.service";

interface DocumentsPanelProps {
  theme: "light" | "dark";
  activeProjectId: string | null;
}

function sourceIcon(source: string) {
  if (/^https?:\/\//i.test(source)) return LinkIcon;
  if (source === "manual-input") return Type;
  return FileText;
}

export default function DocumentsPanel({ theme, activeProjectId }: DocumentsPanelProps) {
  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeProjectId) return;

    setLoading(true);
    setError(null);
    listDocuments(activeProjectId)
      .then(setDocuments)
      .catch((err) => {
        console.error(err);
        setError("Couldn't load documents for this project.");
      })
      .finally(() => setLoading(false));
  }, [activeProjectId]);

  const panelBg = theme === "dark" ? "bg-zinc-950 border-zinc-900" : "bg-white border-slate-200";

  if (!activeProjectId) {
    return (
      <div className="flex-1 flex items-center justify-center p-10 text-center">
        <p className={`text-sm ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
          Select a project to see what's been added to its memory.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Documents</h1>
          <p className={`mt-1 text-sm ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            Everything ingested into this project's memory via Research.
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {loading ? (
          <p className={`text-sm ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>Loading...</p>
        ) : documents.length === 0 ? (
          <p className={`text-sm ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            Nothing here yet - add material via the Research tab.
          </p>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => {
              const Icon = sourceIcon(doc.source);
              return (
                <div key={doc._id} className={`flex items-center justify-between p-4 rounded-xl border ${panelBg}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="h-4 w-4 text-[#2563EB] shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${theme === "dark" ? "text-zinc-200" : "text-slate-800"}`}>
                        {doc.source}
                      </p>
                      <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>
                        {doc.chunksAdded} chunk(s) &middot; {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}