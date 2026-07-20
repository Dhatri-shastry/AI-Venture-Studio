import { authedFetch, authedUpload } from "./apiClient";

export interface DocumentEntry {
  _id: string;
  projectId: string;
  source: string;
  chunksAdded: number;
  createdAt: string;
}

export async function ingestText(projectId: string, text: string, source?: string) {
  return authedFetch("/research", {
    method: "POST",
    body: JSON.stringify({ projectId, text, source }),
  });
}

export async function ingestUrl(projectId: string, url: string) {
  return authedFetch("/research/url", {
    method: "POST",
    body: JSON.stringify({ projectId, url }),
  });
}

export async function ingestFile(projectId: string, file: File) {
  const formData = new FormData();
  formData.append("projectId", projectId);
  formData.append("file", file);
  return authedUpload("/research/upload", formData);
}

export async function listDocuments(projectId: string): Promise<DocumentEntry[]> {
  const data = await authedFetch(`/research/documents?projectId=${encodeURIComponent(projectId)}`, { method: "GET" });
  return data.documents;
}