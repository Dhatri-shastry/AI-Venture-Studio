"use client";

import {
  Plus,
  MessageSquare,
  Folder,
  Clock3,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-[280px] bg-[#0d0d0d] text-white flex flex-col">
      <div className="p-6">
        <h1 className="font-bold text-2xl">
          AI Venture Studio
        </h1>
      </div>

      <div className="px-4">
        <button className="w-full bg-blue-600 rounded-xl py-3 flex items-center justify-center gap-2">
          <Plus size={18} />
          New Chat
        </button>
      </div>

      <div className="mt-8 px-3 flex-1">
        <button className="sidebar-item">
          <MessageSquare size={18} />
          Startup Validation
        </button>

        <button className="sidebar-item">
          <Folder size={18} />
          Projects
        </button>

        <button className="sidebar-item">
          <Clock3 size={18} />
          History
        </button>
      </div>

      <div className="p-4">
        <button className="sidebar-item">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </aside>
  );
}