import { authedFetch, authedUpload } from "./apiClient";

export interface ChatRequest {
  message: string;
  provider?: string;
  projectId?: string;
  chatId?: string;
  attachmentContext?: string;
}

export interface ChatSummary {
  _id: string;
  title: string;
  provider?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export interface ChatDetail extends ChatSummary {
  messages: ChatMessage[];
}

export async function sendMessage(body: ChatRequest) {
  return authedFetch("/chat", { method: "POST", body: JSON.stringify(body) });
}

export async function listChats(): Promise<ChatSummary[]> {
  const data = await authedFetch("/chat", { method: "GET" });
  return data.chats;
}

export async function getChat(chatId: string): Promise<ChatDetail> {
  const data = await authedFetch(`/chat/${chatId}`, { method: "GET" });
  return data.chat;
}

export async function renameChat(chatId: string, title: string) {
  const data = await authedFetch(`/chat/${chatId}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
  return data.chat;
}

export async function deleteChat(chatId: string) {
  await authedFetch(`/chat/${chatId}`, { method: "DELETE" });
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  const data = await authedUpload("/media/transcribe", formData);
  return data.text;
}

export async function analyzeImage(file: File | Blob, projectId?: string): Promise<string> {
  const formData = new FormData();
  formData.append("image", file, file instanceof File ? file.name : "pasted-image.png");
  if (projectId) formData.append("projectId", projectId);
  const data = await authedUpload("/media/image", formData);
  return data.description;
}

export async function extractDocument(file: File, projectId?: string): Promise<{ text: string; filename: string }> {
  const formData = new FormData();
  formData.append("document", file);
  if (projectId) formData.append("projectId", projectId);
  const data = await authedUpload("/media/document", formData);
  return { text: data.text, filename: data.filename };
}