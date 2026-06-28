"use client";

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Paperclip, Mic, ArrowUp, Sparkles, AlertCircle, Compass, ShieldAlert, ArrowRight } from 'lucide-react';
import Image from "next/image";

interface ChatAreaProps {
  theme: 'light' | 'dark';
}

export default function ChatArea({ theme }: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const emptyStateRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Modern suggestion cards (exactly 3 as requested)
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
    // Staggered premium entrance transition matching ChatGPT/Claude layout
    if (emptyStateRef.current) {
      gsap.fromTo(emptyStateRef.current, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
    
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.children;
      gsap.fromTo(cards,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.15 }
      );
    }

    if (inputContainerRef.current) {
      gsap.fromTo(inputContainerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.3 }
      );
    }
  }, []);

  const handleCardClick = (promptText: string) => {
    setInputText(promptText);
    if (textInputRef.current) {
      textInputRef.current.focus();
      gsap.fromTo(textInputRef.current,
        { scale: 0.995 },
        { scale: 1, duration: 0.15, ease: 'power1.out' }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setInputText('');
  };

  return (
    <div
      id="main-chat-area"
      className={`flex-1 flex flex-col h-full overflow-hidden transition-colors duration-300 relative justify-between ${
        theme === 'dark' ? 'bg-black text-zinc-100' : 'bg-[#FAFCFD] text-slate-800'
      }`}
    >
      
      {/* Scrollable chat body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-10 flex flex-col items-center justify-center">
        <div ref={emptyStateRef} className="max-w-2xl w-full flex flex-col items-center text-center">
          
          {/* Extremely compact, non-intrusive robot badge */}
          <div className="relative mb-5 select-none opacity-90 hover:opacity-100 transition-opacity">
            {theme === 'dark' && (
              <div className="absolute h-24 w-24 rounded-full bg-brand-blue/10 blur-xl animate-pulse"></div>
            )}
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-slate-200/40 dark:border-zinc-800/65 shadow-md">
              <Image
  src="/images/assistant-robot.png"
  alt="AI Venture Helper"
  fill
  className="object-cover select-none pointer-events-none"
  priority
/>
            </div>
            {/* Minimal sparkle tag */}
            <div className={`absolute -bottom-1 -right-1 flex items-center justify-center h-6 w-6 rounded-full border shadow-sm ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-brand-blue' : 'bg-white border-slate-100 text-brand-blue'
            }`}>
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Heading - Increased and made closer to premium landing typography style */}
          <h1 className={`text-4xl sm:text-5xl font-[700] tracking-tight font-sans leading-tight transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            What would you like to build today?
          </h1>
          
          <p className={`mt-5 text-lg leading-8 max-w-2xl font-bold  ${
            theme === 'dark' ? 'text-zinc-400' : 'text-[#2563eb]'
          }`}>
            Validate concepts, conduct deep analysis, and build investor-ready reports.
          </p>
            
          {/* Exactly 3 premium suggestions structured as a responsive layout */}
          <div 
            ref={cardsContainerRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full mt-10"
          >
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
                  <p className="text-[11px] leading-relaxed text-slate-400 dark:text-zinc-500 font-normal">
                    {card.subtitle}
                  </p>
                </div>
                
                <div className="mt-3 flex items-center justify-end">
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ChatGPT-style clean bottom centered input box - primary focal point */}
      <div 
        ref={inputContainerRef}
        className={`p-4 md:p-6 w-full max-w-3xl mx-auto ${
          theme === 'dark' ? 'md:bg-transparent' : 'md:bg-transparent'
        }`}
      >
        <form 
          onSubmit={handleSubmit}
          className={`relative rounded-3xl border transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-blue/20 ${
            theme === 'dark' 
              ? 'bg-[#111111] border-zinc-800 focus-within:border-brand-blue/40' 
              : 'bg-white border-slate-200/80 focus-within:border-brand-blue/30 shadow-md'
          }`}
        >
          {/* Text Area */}
          <textarea
            ref={textInputRef}
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Validate an idea, analyze TAM, draft documentation..."
            className={`w-full rounded-t-3xl pt-4 pl-4.5 pr-16 pb-12 text-sm resize-none outline-none focus:ring-0 font-normal ${
              theme === 'dark' ? 'bg-transparent text-zinc-100 placeholder-zinc-500' : 'bg-transparent text-slate-800 placeholder-slate-400'
            }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          {/* Lower controls bar inside the input frame */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between">
            {/* Auxiliary actions */}
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                className={`p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900 ${
                  theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-850'
                }`}
                title="Add attachments"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              
              <button
                type="button"
                className={`p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900 ${
                  theme === 'dark' ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-850'
                }`}
                title="Dictate message"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`flex h-8.5 w-8.5 items-center justify-center rounded-full transition-all ${
                inputText.trim() 
                  ? 'bg-brand-blue text-white hover:bg-brand-blue-hover scale-100 shadow-sm' 
                  : 'bg-slate-105 dark:bg-zinc-900 bg-slate-100 text-slate-400 dark:text-zinc-600 scale-95 cursor-not-allowed opacity-50'
              }`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </form>

        <p className="text-center text-[10.5px] text-slate-400 dark:text-zinc-500 mt-3.5 select-none font-normal">
          AI Venture Studio generates smart outlines. Double-check structural details before execution.
        </p>
      </div>

    </div>
  );
}
