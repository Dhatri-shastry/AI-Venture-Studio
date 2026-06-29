'use client';
import { useEffect, useState } from "react";
import Sidebar from "@/components/workspace/Sidebar";
import ChatHistory from "@/components/workspace/ChatHistory";
import ChatArea from "@/components/workspace/ChatArea";
import RobotAssistant from "@/components/workspace/RobotAssistant";
import WorkspaceHeader from "@/components/workspace/WorkSpaceHeader";


export default function WorkspacePage() {
  // Light is default theme
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('new-chat');
  
  // History panel slide-in state
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  // Mobile layout responsiveness states
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync state theme class to root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleResetChat = () => {
    setActiveTab('new-chat');
    setMobileSidebarOpen(false);
  };

  const handleOpenHistoryDrawer = () => {
    setHistoryDrawerOpen(true);
    setMobileSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 font-sans ${
      theme === 'dark' ? 'bg-black text-zinc-100' : 'bg-[#F8FAFC] text-slate-800'
    }`}>
      
      {/* Left Navigation Sidebar - Fixed or Slider on Mobile */}
      <div className={`fixed inset-y-0 left-0 z-40 md:static md:block ${
        mobileSidebarOpen ? 'block' : 'hidden md:block'
      }`}>
        {/* Backdrop for mobile overlays */}
        {mobileSidebarOpen && (
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
          ></div>
        )}
        <div className="relative z-40 h-full">
          <Sidebar
  theme={theme}
  collapsed={sidebarCollapsed}
  setCollapsed={setSidebarCollapsed}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  onOpenHistory={handleOpenHistoryDrawer}
  onResetChat={handleResetChat}
/>
        </div>
      </div>

      {/* Main Chat Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <WorkspaceHeader
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        {/* Conversation stage occupies almost the entire screen */}
        <ChatArea theme={theme} />
      </div>

      {/* Conversational companion - Floating robot assistant (bottom right, mobile & desktop) */}
      <RobotAssistant theme={theme} />

      {/* Clean Drawer sliding from left for Chat History - shown ONLY on trigger click */}
      <ChatHistory
        theme={theme}
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
      />

    </div>
  );
}
