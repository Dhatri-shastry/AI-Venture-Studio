"use client";

import { 
  Plus, 
  History, 
  Briefcase, 
  Compass, 
  FileText, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Workflow
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface SidebarProps {
  theme: "light" | "dark";
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenHistory: () => void;
  onResetChat: () => void;
}

export default function Sidebar({
  theme,
  collapsed,
  setCollapsed,
  activeTab,
  setActiveTab,
  onOpenHistory,
  onResetChat,
}: SidebarProps) {
  
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const menuItems = [
    { id: 'new-chat', label: 'New Chat', icon: Plus, action: onResetChat },
    { id: 'history', label: 'History', icon: History, action: onOpenHistory },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'research', label: 'Research', icon: Compass },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      id="sidebar-container"
      className={`h-screen flex flex-col border-r transition-all duration-300 ease-in-out shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-[280px]'
      } ${
        theme === 'dark' 
          ? 'bg-[#0B0B0B] border-zinc-900/80 text-zinc-200' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Sidebar Header: Logo & Title */}
      <div className={`p-4 h-14 flex items-center justify-between border-b ${
        theme === 'dark' ? 'border-zinc-900' : 'border-slate-100'
      }`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue text-white shadow-md shadow-brand-blue/15 animate-pulse">
            <Workflow className="h-4.5 w-4.5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col whitespace-nowrap animate-fade-in text-left">
              <span className="text-xs font-extrabold tracking-tight font-sans">
                AI Venture Studio
              </span>
              <span className={`text-[9px] font-medium tracking-wider uppercase ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>
                Creator Suite
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className={`hidden md:flex h-6 w-6 items-center justify-center rounded-md border transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900 ${
              theme === 'dark' ? 'border-zinc-800 bg-zinc-950 text-zinc-400' : 'border-slate-200 bg-white text-slate-500'
            }`}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className={`hidden md:flex mx-auto h-6 w-6 items-center justify-center rounded-md border transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900 ${
              theme === 'dark' ? 'border-zinc-800 bg-zinc-950 text-zinc-400' : 'border-slate-200 bg-white text-slate-500'
            }`}
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Main Menu Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id && item.id !== 'history';
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                isActive 
                  ? 'bg-brand-blue text-white shadow-sm' 
                  : theme === 'dark' 
                    ? 'text-zinc-400 hover:text-white hover:bg-zinc-90 w-full hover:bg-zinc-900/60' 
                    : 'text-slate-650 text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <IconComponent className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-zinc-400'}`} />
              {!collapsed && (
                <span className="truncate whitespace-nowrap font-medium text-[15px]">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className={`p-4 border-t ${
        theme === 'dark' ? 'border-zinc-900 bg-zinc-950/20' : 'border-slate-100 bg-slate-50/20'
      }`}>
        <div className="flex flex-col space-y-4">
          
          {/* User Profile item */}
          <div className="flex items-center justify-between overflow-hidden">
            <div className="flex items-center space-x-3 min-w-0">
              <div
  id="user-avatar"
  className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-blue-600 text-white font-bold text-xs shadow-sm shadow-blue-600/10 flex items-center justify-center"
>
  {user?.photoURL ? (
    <Image
      src={user.photoURL}
      alt={user.displayName || "User"}
      fill
      className="object-cover"
      unoptimized
    />
  ) : (
    <span>
      {user?.displayName
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U"}
    </span>
  )}
</div>
              {!collapsed && (
                <div className="flex flex-col min-w-0 text-left">
                  <span
  className={`text-xs font-bold truncate ${
    theme === "dark"
      ? "text-zinc-300"
      : "text-slate-800"
  }`}
>
  {user?.displayName || "Guest User"}
</span>
                  <span className="text-[10px] text-slate-400 truncate dark:text-zinc-500">
  {user?.email || ""}
</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </aside>
  );
}
