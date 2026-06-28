import React from 'react';
import { Menu, MessageSquare, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface WorkspaceHeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenMobileSidebar: () => void;
  sidebarCollapsed: boolean;
}

export default function WorkspaceHeader({
  theme,
  toggleTheme,
  onOpenMobileSidebar,
  sidebarCollapsed,
}: WorkspaceHeaderProps) {
  return (
    <header
      id="workspace-header"
      className={`sticky top-0 z-20 flex h-14 items-center justify-between border-b px-4 md:px-6 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-zinc-950/80 border-zinc-800/80 text-zinc-100 backdrop-blur-md' 
          : 'bg-white/80 border-slate-200/80 text-slate-800 backdrop-blur-md'
      }`}
    >
      {/* Left Menu toggle for Mobile */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobileSidebar}
          className="mr-1 rounded-lg p-1.5 md:hidden focus:outline-none hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dynamic Model Title Select element */}
        <div className="flex items-center space-x-1.5 cursor-pointer group py-1 px-2 rounded-lg hover:bg-slate-105 hover:bg-slate-100/60 dark:hover:bg-zinc-900/60 transition-colors">
          <span className={`text-sm font-semibold tracking-tight font-sans ${theme === 'dark' ? 'text-zinc-200' : 'text-slate-800'}`}>
            Venture Copilot
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
            theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-150 bg-slate-100 text-slate-600'
          }`}>
            v3.5
          </span>
          <ChevronDown className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-zinc-300 transition-colors" />
        </div>
      </div>

      {/* Right Tools - Theme Toggle */}
      <div className="flex items-center space-x-2">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} className="scale-90" />
      </div>
    </header>
  );
}
