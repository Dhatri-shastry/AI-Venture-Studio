import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Venture Studio Workspace",
  description:
    "Premium AI Chatbot Workspace for startup validation, market research, and venture documentation.",
};

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-black overflow-hidden font-sans select-none">
      {children}
    </div>
  );
}