import { authedFetch } from "./apiClient";

export interface Project {
  _id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function listProjects(): Promise<Project[]> {
  const data = await authedFetch("/project", { method: "GET" });
  return data.projects;
}

export async function createProject(title: string, description?: string): Promise<Project> {
  const data = await authedFetch("/project", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
  return data.project;
}

export async function getProject(id: string): Promise<Project> {
  const data = await authedFetch(`/project/${id}`, { method: "GET" });
  return data.project;
}