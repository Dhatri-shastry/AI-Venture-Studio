"use client";

import { useEffect, useState } from "react";
import { Plus, Briefcase, Loader2 } from "lucide-react";
import { listProjects, createProject, Project } from "@/services/project.service";

interface ProjectsPanelProps {
  theme: "light" | "dark";
  activeProjectId: string | null;
  onSelectProject: (projectId: string) => void;
}

export default function ProjectsPanel({ theme, activeProjectId, onSelectProject }: ProjectsPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listProjects()
      .then(setProjects)
      .catch((err) => {
        console.error(err);
        setError("Couldn't load your projects - try refreshing.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setCreating(true);
      setError(null);
      const project = await createProject(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
      setProjects((prev) => [project, ...prev]);
      onSelectProject(project._id);
    } catch (err) {
      console.error(err);
      setError("Couldn't create that project - give it another try?");
    } finally {
      setCreating(false);
    }
  };

  const panelBg = theme === "dark" ? "bg-zinc-950 border-zinc-900" : "bg-white border-slate-200";
  const inputCls = theme === "dark"
    ? "bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500"
    : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400";

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Projects</h1>
          <p className={`mt-1 text-sm ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            Select a project to scope chats and research to it - it becomes long-term memory for that venture.
          </p>
        </div>

        <form onSubmit={handleCreate} className={`p-5 rounded-2xl border space-y-3 ${panelBg}`}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project name (e.g. Robotic Vacuum Startup)"
            className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none border ${inputCls}`}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={2}
            className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none border resize-none ${inputCls}`}
          />
          <button
            type="submit"
            disabled={creating || !title.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create Project
          </button>
        </form>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {loading ? (
          <p className={`text-sm ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>Loading...</p>
        ) : projects.length === 0 ? (
          <p className={`text-sm ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            No projects yet - create your first one above.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <button
                key={project._id}
                onClick={() => onSelectProject(project._id)}
                className={`text-left p-4 rounded-2xl border transition ${
                  project._id === activeProjectId
                    ? "border-[#2563EB] ring-1 ring-[#2563EB]"
                    : theme === "dark" ? "border-zinc-900 hover:border-zinc-700" : "border-slate-200 hover:border-slate-300"
                } ${panelBg}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="h-4 w-4 text-[#2563EB]" />
                  <span className={`font-semibold text-sm ${theme === "dark" ? "text-zinc-100" : "text-slate-900"}`}>
                    {project.title}
                  </span>
                </div>
                {project.description && (
                  <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>{project.description}</p>
                )}
                {project._id === activeProjectId && (
                  <span className="mt-2 inline-block text-[10px] font-bold uppercase tracking-wide text-[#2563EB]">Active</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}