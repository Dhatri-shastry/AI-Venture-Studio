"use client";

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Paperclip, Mic, Square, ArrowUp, Sparkles, ArrowRight, X, FileText, Loader2 } from 'lucide-react';
import Image from "next/image";
import { sendMessage, getChat, transcribeAudio, analyzeImage, extractDocument } from '@/services/chat.service';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatAreaProps {
  theme: 'light' | 'dark';
  chatId?: string | null;
  onChatIdChange?: (chatId: string | null) => void;
  projectId?: string | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Attachment {
  name: string;
  text: string;
  kind: "image" | "document";
}

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];

export default function ChatArea({ theme, chatId: chatIdProp, onChatIdChange, projectId }: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const textInputRef = useRef<HTMLTextAreaElement>(null);
// Auto-grows the textarea with content, up to a max height, then scrolls.
useEffect(() => {
  const el = textInputRef.current;
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
}, [inputText]);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const emptyStateRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // File/photo attachment
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [attaching, setAttaching] = useState(false);

  const [internalChatId, setInternalChatId] = useState<string | null>(null);
  const chatId = chatIdProp !== undefined ? chatIdProp : internalChatId;

  const updateChatId = (id: string | null) => {
    if (onChatIdChange) onChatIdChange(id);
    else setInternalChatId(id);
  };

  const loadedChatIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (chatId === loadedChatIdRef.current) return;
    loadedChatIdRef.current = chatId ?? null;

    if (!chatId) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoadingHistory(true);
    setErrorMessage(null);

    getChat(chatId)
      .then((chat) => {
        if (cancelled) return;
        setMessages(chat.messages.map((m) => ({ role: m.role, content: m.content })));
      })
      .catch((err) => {
        console.error("Failed to load chat history", err);
        if (!cancelled) setErrorMessage("Couldn't load that conversation - give it another try?");
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });

    return () => { cancelled = true; };
  }, [chatId]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [messages]);

  const suggestions = [
    {
      title: 'Startup Validation',
      subtitle: 'Analyze unit economics and define key customer acquisition channels',
      prompt: "Can you help me validate a startup concept? Let's analyze the target custom persona, core unit economics, and scalable marketing strategy."
    },
    {
      title: 'Market Research',
      subtitle: 'Identify total addressable market (TAM) bounds and analyze competitors',
      prompt: "Perform a comprehensive market research deep-dive. Detail major players, estimate the total addressable market (TAM), and pinpoint key vectors of differentiation."
    },
    {
      title: 'Product Strategy',
      subtitle: 'Draft a sequential launch roadmap and map high-impact MVP features',
      prompt: "Let's align on product strategy. Help me construct a structured, multi-phase technical roadmap to specify high-priority features for a proof of concept."
    }
  ];

  useEffect(() => {
    if (emptyStateRef.current) {
      gsap.fromTo(emptyStateRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
    }
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.children;
      gsap.fromTo(cards, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.15 });
    }
    if (inputContainerRef.current) {
      gsap.fromTo(inputContainerRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.3 });
    }
  }, []);

  const handleCardClick = (promptText: string) => {
    setInputText(promptText);
    if (textInputRef.current) {
      textInputRef.current.focus();
      gsap.fromTo(textInputRef.current, { scale: 0.995 }, { scale: 1, duration: 0.15, ease: 'power1.out' });
    }
  };

  // ---------- Voice recording ----------
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        try {
          setTranscribing(true);
          const text = await transcribeAudio(audioBlob);
          setInputText((prev) => (prev ? `${prev} ${text}` : text));
        } catch (err) {
          console.error("Transcription failed", err);
          setErrorMessage("Couldn't catch that - mind trying the recording again?");
        } finally {
          setTranscribing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access failed", err);
      setErrorMessage("Couldn't access your microphone - check your browser's permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleMicClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  // ---------- File / photo attachment ----------
  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isImage = IMAGE_EXTENSIONS.includes(ext);

    try {
      setAttaching(true);
      setErrorMessage(null);

      if (isImage) {
        const description = await analyzeImage(file, projectId ?? undefined);
        setAttachment({ name: file.name, text: description, kind: "image" });
      } else {
        const { text } = await extractDocument(file, projectId ?? undefined);
        setAttachment({ name: file.name, text, kind: "document" });
      }
    } catch (err) {
      console.error("Attachment processing failed", err);
      setErrorMessage(err instanceof Error ? err.message : "Couldn't process that file - try a different one?");
    } finally {
      setAttaching(false);
    }
  };

  // ---------- Paste-to-attach an image ----------
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        try {
          setAttaching(true);
          setErrorMessage(null);
          const description = await analyzeImage(file, projectId ?? undefined);
          setAttachment({ name: "Pasted image", text: description, kind: "image" });
        } catch (err) {
          console.error("Pasted image processing failed", err);
          setErrorMessage("Couldn't process that image - try uploading it instead?");
        } finally {
          setAttaching(false);
        }
        return;
      }
    }
  };


  // ---------- Send ----------
  const handleSubmit = async (e?: React.FormEvent) => {
  e?.preventDefault();

  if (!inputText.trim() && !attachment) return;

  const attachmentContext = attachment?.text;
  const userMessage = [
    inputText.trim(),
    attachment ? `📎 ${attachment.name}` : null,
  ].filter(Boolean).join("\n");

  setMessages(prev => [...prev, { role: "user", content: userMessage }]);
  setInputText("");
  setAttachment(null);
  setErrorMessage(null);

  try {
    setLoading(true);
    const response = await sendMessage({
      message: inputText,
      provider: "gemini",
      chatId: chatId ?? undefined,
      projectId: projectId ?? undefined,
      attachmentContext,
    });

    setMessages(prev => [...prev, { role: "assistant", content: response.report }]);

    if (response.chatId) {
      loadedChatIdRef.current = response.chatId;
      updateChatId(response.chatId);
    }
  } catch (error) {
    console.error(error);
    setErrorMessage("Something went wrong on my end - give that another try in a second?");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      id="main-chat-area"
      className={`flex-1 flex flex-col h-full overflow-hidden transition-colors duration-300 relative justify-between ${
        theme === 'dark' ? 'bg-black text-zinc-100' : 'bg-[#FAFCFD] text-slate-800'
      }`}
    >
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-10">
        {loadingHistory ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-400 dark:text-zinc-500">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div ref={emptyStateRef} className="max-w-2xl w-full flex flex-col items-center text-center">
              <div className="relative mb-5 select-none opacity-90 hover:opacity-100 transition-opacity">
                {theme === 'dark' && (
                  <div className="absolute h-24 w-24 rounded-full bg-brand-blue/10 blur-xl animate-pulse"></div>
                )}
                <div className="relative h-22 w-22 overflow-hidden rounded-full border-2 border-slate-200/40 dark:border-zinc-800/65 shadow-md">
                  <Image
                    src="/images/assistant-robot.png"
                    alt="AI Venture Helper"
                    fill
                    sizes="88px"
                    className="object-cover select-none pointer-events-none"
                    priority
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 flex items-center justify-center h-6 w-6 rounded-full border shadow-sm ${
                  theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-brand-blue' : 'bg-white border-slate-100 text-brand-blue'
                }`}>
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>

              <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight font-sans leading-tight transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                What would you like to build today?
              </h1>

              <p className={`mt-5 text-lg leading-8 max-w-2xl font-bold ${
                theme === 'dark' ? 'text-zinc-400' : 'text-[#2563eb]'
              }`}>
                Validate concepts, conduct deep analysis, and build investor-ready reports.
              </p>

              <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full mt-10">
                {suggestions.map((card, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCardClick(card.prompt)}
                    className={`group p-4 rounded-2xl text-left border transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between ${
                      theme === 'dark'
                        ? 'bg-zinc-950 border-zinc-900/90 text-zinc-300 hover:border-brand-blue/40 hover:bg-zinc-900/40'
                        : 'bg-white border-slate-200/80 text-slate-700 hover:border-brand-blue/30 hover:bg-slate-50/50 shadow-xs'
                    }`}
                  >
                    <div>
                      <h3 className={`text-xs font-bold font-sans tracking-wide mb-1 transition-colors group-hover:text-brand-blue ${
                        theme === 'dark' ? 'text-zinc-200' : 'text-slate-900'
                      }`}>
                        {card.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-400 dark:text-zinc-500 font-normal">
                        {card.subtitle}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-end">
                      <ArrowRight className="h-4 w-4 text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                ref={index === messages.length - 1 ? lastMessageRef : null}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                    message.role === "user"
                      ? "bg-[#2563EB] text-white"
                      : theme === "dark" ? "bg-zinc-900 text-white" : "bg-gray-100 text-black"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-lg font-semibold mb-2">{children}</h3>,
                        p: ({ children }) => <p className="mb-3 leading-7">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc ml-6 mb-3 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal ml-6 mb-3 space-y-1">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        code: ({ children }) => (
                          <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5 text-sm">{children}</code>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <span>{message.content}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className={`rounded-2xl px-5 py-3 ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-gray-100 text-black'}`}>
                  ...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={inputContainerRef} className="p-4 md:p-6 w-full max-w-4xl mx-auto">
        {errorMessage && (
          <div className={`mb-2 flex items-center justify-between px-4 py-2 rounded-xl text-sm ${
            theme === 'dark' ? 'bg-red-950/40 text-red-300 border border-red-900/50' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="ml-3 opacity-70 hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {attachment && (
          <div className={`mb-2 flex items-center justify-between px-4 py-2 rounded-xl text-sm ${
            theme === 'dark' ? 'bg-zinc-900 border border-zinc-800 text-zinc-300' : 'bg-slate-50 border border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-[#2563EB] shrink-0" />
              <span className="truncate">{attachment.name}</span>
            </div>
            <button onClick={() => setAttachment(null)} className="ml-3 opacity-70 hover:opacity-100 shrink-0">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {(attaching || transcribing) && (
          <div className="mb-2 flex items-center gap-2 px-4 py-2 text-sm text-slate-400 dark:text-zinc-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>{attaching ? "Reading your file..." : "Transcribing..."}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`relative rounded-3xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-blue/20 ${
            theme === 'dark' ? 'bg-[#111111] border-zinc-800 focus-within:border-brand-blue/40' : 'bg-white border-slate-200/80 focus-within:border-brand-blue/30 shadow-md'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelected}
            accept=".pdf,.docx,.pptx,.txt,.md,.csv,.jpg,.jpeg,.png,.webp,.gif"
          />

          <textarea
  ref={textInputRef}
  value={inputText}
  onChange={(e) => setInputText(e.target.value)}
  onPaste={handlePaste}
  placeholder="Validate an idea, analyze TAM, draft documentation..."
  className={`w-full rounded-t-3xl pt-4 pl-4.5 pr-16 pb-12 text-base resize-none outline-none focus:ring-0 font-normal overflow-y-auto ${
    theme === 'dark' ? 'bg-transparent text-zinc-100 placeholder-zinc-500' : 'bg-transparent text-slate-800 placeholder-slate-400'
  }`}
  style={{ minHeight: '60px', maxHeight: '200px' }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }}
/>

          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={handleAttachClick}
                disabled={attaching}
                className={`p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900 disabled:opacity-50 ${
                  theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-850'
                }`}
                title="Add attachments"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={handleMicClick}
                disabled={transcribing}
                className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
                  isRecording
                    ? 'bg-red-500/10 text-red-500 animate-pulse'
                    : theme === 'dark'
                      ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100'
                }`}
                title={isRecording ? "Stop recording" : "Dictate message"}
              >
                {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 bg-[#2563EB] hover:bg-blue-700"
            >
              <ArrowUp className="h-5 w-5 text-white" />
            </button>
          </div>
        </form>

        <p className="text-center text-[10.5px] text-sm dark:text-zinc-500 mt-3.5 select-none font-normal">
          AI Venture Studio generates smart outlines. Double-check structural details before execution.
        </p>
      </div>
    </div>
  );
}