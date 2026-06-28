"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Sparkles, X, MessageSquare } from 'lucide-react';
import Image from "next/image";

interface RobotAssistantProps {
  theme: 'light' | 'dark';
}

export default function RobotAssistant({ theme }: RobotAssistantProps) {
  const robotRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<HTMLDivElement>(null);
  const [showSpeech, setShowSpeech] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  const nativeTips = [
    "Need validation? Let's stress test unit economics for your idea.",
    "I can instantly map out key customer acquisition channels.",
    "Would you like me to outline your startup pitch deck?",
    "Need custom investor documents or business templates?"
  ];

  useEffect(() => {
    // Elegant floating/bouncing animation with GSAP as requested
    const el = robotRef.current;
    if (el) {
      gsap.to(el, {
        y: -10,
        duration: 2.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });
    }

    // Speech bubble subtle drop-in transition
    const speech = speechRef.current;
    if (speech && showSpeech) {
      gsap.fromTo(speech, 
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }
      );
    }
  }, [showSpeech, tipIndex]);

  const cycleTip = () => {
    const speech = speechRef.current;
    if (speech) {
      gsap.to(speech, {
        scale: 0.9,
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          setTipIndex((prev) => (prev + 1) % nativeTips.length);
          setShowSpeech(true);
        }
      });
    } else {
      setTipIndex((prev) => (prev + 1) % nativeTips.length);
      setShowSpeech(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none">
      
      {/* Speech bubble above chatbot. Only visible when requested / toggled */}
      {showSpeech && (
        <div 
          ref={speechRef}
          onClick={cycleTip}
          className={`mb-3 pointer-events-auto max-w-[240px] p-3 rounded-xl border shadow-md cursor-pointer select-none relative transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-brand-blue/60' 
              : 'bg-white border-slate-200 text-slate-700 hover:shadow-lg hover:border-slate-300'
          }`}
        >
          {/* Subtle pointer tip */}
          <div className={`absolute bottom-[-6px] right-6 w-3 h-3 rotate-45 border-r border-b ${
            theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
          }`}></div>

          <div className="flex items-start gap-2 pr-4">
            <Sparkles className="h-3.5 w-3.5 text-brand-blue shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-sans font-medium">
              {nativeTips[tipIndex]}
            </p>
          </div>

          {/* Close tiny button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSpeech(false);
            }}
            className="absolute top-1.5 right-1.5 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-205 rounded transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Actual Avatar Graphic - Floating bouncy companion */}
      <div 
        ref={robotRef}
        onClick={() => {
          if (!showSpeech) {
            setShowSpeech(true);
          } else {
            cycleTip();
          }
        }}
        className="pointer-events-auto relative cursor-pointer group flex items-center justify-center"
      >
        {/* Soft interactive glow ring */}
        <div className={`absolute inset-0 rounded-full blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-60 ${
          theme === 'dark' ? 'bg-brand-blue/30' : 'bg-brand-blue/15'
        }`}></div>

        <div className={`relative h-14 w-14 rounded-full overflow-hidden border-2 shadow-lg transition-transform duration-300 group-hover:scale-110 ${
          theme === 'dark' 
            ? 'border-brand-blue bg-zinc-950 shadow-brand-blue/10' 
            : 'border-white bg-white shadow-slate-200'
        }`}>
          <Image
  src="/images/assistant-robot.png"
  alt="AI Companion"
  fill
  priority
  className="object-cover select-none"
/>
        </div>

        {/* Small live status bubble indicator */}
        <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 animate-pulse"></div>
      </div>

    </div>
  );
}
