"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Search, X, Inbox, FolderClosed } from "lucide-react";

interface ChatHistoryProps {
  theme: "light" | "dark";
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatHistory({
  theme,
  isOpen,
  onClose,
}: ChatHistoryProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    const backdrop = backdropRef.current;

    if (isOpen) {
      if (el) {
        gsap.fromTo(
          el,
          { x: "-100%", opacity: 0.9 },
          {
            x: "0%",
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
          }
        );
      }

      if (backdrop) {
        gsap.fromTo(
          backdrop,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.3,
          }
        );
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    const el = panelRef.current;

    if (el) {
      gsap.to(el, {
        x: "-100%",
        opacity: 0.9,
        duration: 0.3,
        ease: "power3.in",
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex pointer-events-none">

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/10 dark:bg-black/40 backdrop-blur-xs pointer-events-auto transition-opacity"
      />

      {/* History Panel */}
      <div
        ref={panelRef}
        id="sliding-chat-history"
        className={`relative h-full w-[320px] max-w-full flex flex-col border-r pointer-events-auto transition-colors duration-300 shadow-2xl ${
          theme === "dark"
            ? "bg-[#0B0B0B] border-zinc-900 text-zinc-100 shadow-brand-blue/5"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 h-16 flex items-center justify-between border-b ${
            theme === "dark"
              ? "border-zinc-900"
              : "border-slate-100"
          }`}
        >
          <div className="flex items-center space-x-2">
            <FolderClosed className="h-5 w-5 text-[#2563EB]" />

            <span className="text-sm font-semibold uppercase tracking-wider">
              Workspace History
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="h-5 w-5 text-[#2563EB]" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#2563EB]" />

            <input
              type="text"
              placeholder="Search past ideas..."
              className={`w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#2563EB] ${
                theme === "dark"
                  ? "bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-[#2563EB]"
                  : "bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-[#2563EB]"
              }`}
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-center text-center">

          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center mb-4 ${
              theme === "dark"
                ? "bg-zinc-900"
                : "bg-slate-100"
            }`}
          >
            <Inbox className="h-6 w-6 text-[#2563EB]" />
          </div>

          <h3
            className={`text-sm font-bold uppercase tracking-wider mb-2 ${
              theme === "dark"
                ? "text-zinc-100"
                : "text-slate-800"
            }`}
          >
            No History Found
          </h3>

          <p className="text-sm text-[#2563EB] leading-relaxed max-w-[220px]">
            Your workspace runs are kept local and private. Submit a chat in
            the strategy room to automatically generate reports.
          </p>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t text-xs text-center text-[#2563EB] ${
            theme === "dark"
              ? "border-zinc-900"
              : "border-slate-100"
          }`}
        >
          Venture Lab Security Standard Encrypted
        </div>
      </div>
    </div>
  );
}