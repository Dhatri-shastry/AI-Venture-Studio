import Sidebar from "@/components/workspace/Sidebar";
import ChatArea from "@/components/workspace/ChatArea";
import AssistantPanel from "@/components/workspace/AssistantPanel";

export default function WorkspacePage() {
  return (
    <main className="h-screen bg-[#f6f8fc] dark:bg-black p-6">
      <div className="h-full rounded-[32px] overflow-hidden bg-white dark:bg-[#0d0d0d] shadow-2xl flex">
        <Sidebar />

        <ChatArea />

        <AssistantPanel />
      </div>
    </main>
  );
}