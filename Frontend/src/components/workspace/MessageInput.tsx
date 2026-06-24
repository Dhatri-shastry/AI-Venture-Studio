"use client";

import { Paperclip, Send } from "lucide-react";

export default function MessageInput() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#151515] border rounded-2xl flex items-center px-4 py-4 shadow-sm">
        <Paperclip size={18} />

        <input
          className="flex-1 px-4 outline-none bg-transparent"
          placeholder="Message AI Venture Studio..."
        />

        <button className="bg-blue-600 text-white rounded-xl p-2">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}