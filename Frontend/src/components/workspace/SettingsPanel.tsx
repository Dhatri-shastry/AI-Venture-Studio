"use client";

import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Check } from "lucide-react";

interface SettingsPanelProps {
  theme: "light" | "dark";
}

type Provider = "gemini" | "groq" | "openrouter";

const PROVIDERS: { id: Provider; label: string; note: string }[] = [
  { id: "gemini", label: "Gemini", note: "Default - fast, handles voice & photos too" },
  { id: "groq", label: "Groq", note: "Fastest text responses" },
  { id: "openrouter", label: "OpenRouter", note: "Access to other models" },
];

export function getStoredProvider(): Provider {
  if (typeof window === "undefined") return "gemini";
  return (localStorage.getItem("defaultProvider") as Provider) || "gemini";
}

export default function SettingsPanel({ theme }: SettingsPanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [provider, setProvider] = useState<Provider>("gemini");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    setProvider(getStoredProvider());
    return () => unsubscribe();
  }, []);

  const selectProvider = (id: Provider) => {
    setProvider(id);
    localStorage.setItem("defaultProvider", id);
  };

  const panelBg = theme === "dark" ? "bg-zinc-950 border-zinc-900" : "bg-white border-slate-200";

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-slate-900"}`}>Settings</h1>
        </div>

        <div className={`p-5 rounded-2xl border ${panelBg}`}>
          <h2 className={`text-xs font-bold uppercase tracking-wide mb-1 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            Account
          </h2>
          <p className={`text-sm font-medium ${theme === "dark" ? "text-zinc-200" : "text-slate-800"}`}>
            {user?.displayName || "Guest User"}
          </p>
          <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>{user?.email}</p>
        </div>

        <div className={`p-5 rounded-2xl border ${panelBg}`}>
          <h2 className={`text-xs font-bold uppercase tracking-wide mb-3 ${theme === "dark" ? "text-zinc-500" : "text-slate-500"}`}>
            Default AI Provider
          </h2>
          <div className="space-y-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => selectProvider(p.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                  provider === p.id
                    ? "border-[#2563EB] ring-1 ring-[#2563EB]"
                    : theme === "dark" ? "border-zinc-800 hover:border-zinc-700" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <p className={`text-sm font-medium ${theme === "dark" ? "text-zinc-200" : "text-slate-800"}`}>{p.label}</p>
                  <p className={`text-xs ${theme === "dark" ? "text-zinc-500" : "text-slate-400"}`}>{p.note}</p>
                </div>
                {provider === p.id && <Check className="h-4 w-4 text-[#2563EB] shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}