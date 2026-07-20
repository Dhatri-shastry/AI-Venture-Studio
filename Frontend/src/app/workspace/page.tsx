'use client';
import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Sidebar from "@/components/workspace/Sidebar";
import ChatHistory from "@/components/workspace/ChatHistory";
import ChatArea from "@/components/workspace/ChatArea";
import ProjectsPanel from "@/components/workspace/ProjectsPanel";
import ResearchPanel from "@/components/workspace/ResearchPanel";
import DocumentsPanel from "@/components/workspace/DocumentsPanel";
import SettingsPanel from "@/components/workspace/SettingsPanel";
import RobotAssistant from "@/components/workspace/RobotAssistant";
import WorkspaceHeader from "@/components/workspace/WorkSpaceHeader";

function WorkspaceContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeChatId = searchParams.get("chat");
  const activeProjectId = searchParams.get("project");

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('new-chat');
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const updateUrlParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    setRefreshKey((k) => k + 1);
  };

  const handleResetChat = () => {
    setActiveTab('new-chat');
    setMobileSidebarOpen(false);
    updateUrlParams({ chat: null });
  };

  const handleSelectChat = (chatId: string) => {
    setActiveTab('new-chat');
    setMobileSidebarOpen(false);
    updateUrlParams({ chat: chatId });
  };

  const handleSelectProject = (projectId: string) => {
    updateUrlParams({ project: projectId });
  };

  const handleOpenHistoryDrawer = () => {
    setHistoryDrawerOpen(true);
    setMobileSidebarOpen(false);
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-300 font-sans ${
      theme === 'dark' ? 'bg-black text-zinc-100' : 'bg-[#F8FAFC] text-slate-800'
    }`}>

      <div className={`fixed inset-y-0 left-0 z-40 md:static md:block ${mobileSidebarOpen ? 'block' : 'hidden md:block'}`}>
        {mobileSidebarOpen && (
          <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"></div>
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
            onSelectChat={handleSelectChat}
            refreshKey={refreshKey}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <WorkspaceHeader
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {activeTab === 'projects' ? (
          <ProjectsPanel theme={theme} activeProjectId={activeProjectId} onSelectProject={handleSelectProject} />
        ) : activeTab === 'research' ? (
          <ResearchPanel theme={theme} activeProjectId={activeProjectId} />
        ) : activeTab === 'documents' ? (
          <DocumentsPanel theme={theme} activeProjectId={activeProjectId} />
        ) : activeTab === 'settings' ? (
          <SettingsPanel theme={theme} />
        ) : (
          <ChatArea
            theme={theme}
            chatId={activeChatId}
            onChatIdChange={(id) => updateUrlParams({ chat: id })}
            projectId={activeProjectId}
          />
        )}
      </div>

      <RobotAssistant theme={theme} />

      <ChatHistory
        theme={theme}
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        onSelectChat={handleSelectChat}
      />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceContent />
    </Suspense>
  );
}