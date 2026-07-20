"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Search, X, Inbox, FolderClosed, Trash2 } from "lucide-react";
import { listChats, deleteChat, ChatSummary } from "@/services/chat.service";

interface ChatHistoryProps {
  theme: "light" | "dark";
  isOpen: boolean;
  onClose: () => void;
  onSelectChat?: (chatId: string) => void;
}

export default function ChatHistory({ theme, isOpen, onClose, onSelectChat }: ChatHistoryProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    listChats()
      .then(setChats)
      .catch((err) => console.error("Failed to load chat history", err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
    } catch (err) {
      console.error("Failed to delete chat", err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const el = panelRef.current;
    const backdrop = backdropRef.current;

    if (isOpen) {
      if (el) {
        gsap.fromTo(el, { x: "-100%", opacity: 0.9 }, { x: "0%", opacity: 1, duration: 0.4, ease: "power3.out" });
      }
      if (backdrop) {
        gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    const el = panelRef.current;
    if (el) {
      gsap.to(el, { x: "-100%", opacity: 0.9, duration: 0.3, ease: "power3.in", onComplete: onClose });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/10 dark:bg-black/40 backdrop-blur-xs pointer-events-auto transition-opacity"
      />

      <div
        ref={panelRef}
        id="sliding-chat-history"
        className={`relative h-full w-[320px] max-w-full flex flex-col border-r pointer-events-auto transition-colors duration-300 shadow-2xl ${
          theme === "dark" ? "bg-[#0B0B0B] border-zinc-900 text-zinc-100 shadow-brand-blue/5" : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        <div className={`p-4 h-16 flex items-center justify-between border-b ${theme === "dark" ? "border-zinc-900" : "border-slate-100"}`}>
          <div className="flex items-center space-x-2">
            <FolderClosed className="h-5 w-5 text-[#2563EB]" />
            <span className="text-sm font-semibold uppercase tracking-wider">Workspace History</span>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors">
            <X className="h-5 w-5 text-[#2563EB]" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#2563EB]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search past ideas..."
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#2563EB] ${
                theme === "dark"
                  ? "bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-[#2563EB]"
                  : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-[#2563EB]"
              }`}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-slate-400 dark:text-zinc-500">
            Loading...
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-center text-center">
            <div className={`h-14 w-14 rounded-full flex items-center justify-center mb-4 ${theme === "dark" ? "bg-zinc-900" : "bg-slate-100"}`}>
              <Inbox className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${theme === "dark" ? "text-zinc-100" : "text-slate-800"}`}>
              No History Found
            </h3>
            <p className="text-sm text-[#2563EB] leading-relaxed max-w-[220px]">
              Your workspace runs are kept local and private. Submit a chat in the strategy room to automatically generate reports.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            {filteredChats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => {
                  onSelectChat?.(chat._id);
                  handleClose();
                }}
                className={`group w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm transition ${
                  theme === "dark" ? "hover:bg-zinc-900 text-zinc-300" : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{chat.title}</p>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  onClick={(e) => handleDelete(e, chat._id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </div>
        )}

        <div className={`p-4 border-t text-xs text-center text-[#2563EB] ${theme === "dark" ? "border-zinc-900" : "border-slate-100"}`}>
          Venture Lab Security Standard Encrypted
        </div>
      </div>
    </div>
  );
}