"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  MessageSquare,
  Bot,
  Sparkles,
  Send,
  Plus,
  ArrowLeft,
  Terminal,
  Cpu,
  Layers,
  Fingerprint,
} from "lucide-react";

interface ChatbotViewProps {
  onGoToDashboard: () => void;
  onGoToLanding: () => void;
}

export default function ChatbotView({ onGoToDashboard, onGoToLanding }: ChatbotViewProps) {
  const [activeSession, setActiveSession] = useState('session-1');
  const [inputText, setInputText] = useState('');

  // SESSIONS LIST SHOWCASE SIDEBAR
  const sessions = [
    { id: 'session-1', title: 'TAM & CAGR Diagnostics', timestamp: '10 mins ago', active: true },
    { id: 'session-2', title: 'Seed Pitch Outline Brief', timestamp: '2 hours ago', active: false },
    { id: 'session-3', title: 'Competitor Gap Assessment', timestamp: 'Yesterday', active: false },
    { id: 'session-4', title: 'Cohort Pricing Modeling', timestamp: '3 days ago', active: false },
  ];

  // STARTER SYSTEM COMMAND CHIPS
  const starterPrompts = [
    { title: 'Model TAM calculations', desc: 'Structure global and addressable diagnostics metrics.' },
    { title: 'Outline competitor defensive angles', desc: 'Deconstruct incumbent market moats.' },
    { title: 'Model recurring cohort cohorts', desc: 'Predict enterprise SaaS contract variables.' },
    { title: 'Assemble pitch deck script', desc: 'Formulate chronological slide outline structures.' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#0A0D14] flex flex-col transition-colors text-slate-800 dark:text-slate-200">
      
      {/* GLOBAL BANNER */}
      <div className="bg-blue-600 px-4 py-2 text-center text-xs font-semibold text-white flex justify-between items-center sm:px-6">
        <div className="flex items-center space-x-1">
          <Terminal className="h-3.5 w-3.5 animate-pulse" />
          <span>PROTOTYPE CANVAS: PHASE 1 FRONTEND INTERFACE RUNTIME ACTIVE</span>
        </div>
        <button
          onClick={onGoToDashboard}
          className="hover:underline flex items-center space-x-1 cursor-pointer bg-blue-700 hover:bg-blue-800 px-2.5 py-0.5 rounded text-[10px]"
        >
          <span>Return to Diagnostics</span>
          <span>→</span>
        </button>
      </div>

      {/* CORE THREE-COLUMN CHAT SYSTEM LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* COLUMN 1: CHAT CHANNELS SIDEBAR */}
        <aside className="w-64 border-r border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#11131E] flex flex-col justify-between hidden md:flex shrink-0">
          <div className="p-4 space-y-4">
            
            {/* New Thread Action Button */}
            <button className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 bg-blue-50 hover:bg-blue-100 text-[#3B82F6] dark:bg-blue-950/20 dark:hover:bg-blue-900/30 text-xs font-bold rounded-full border border-blue-200/40 transition-all cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Initiate Chat Sandbox</span>
            </button>

            {/* List group */}
            <div className="space-y-3">
              <p className="px-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">
                Recent Audits
              </p>
              
              <div className="space-y-1">
                {sessions.map((sess) => (
                  <button
                    key={sess.id}
                    onClick={() => setActiveSession(sess.id)}
                    className={`w-full text-left p-2.5 px-4 rounded-full text-xs transition-all flex items-start space-x-2.5 cursor-pointer ${
                      activeSession === sess.id
                        ? 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/15 font-bold'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-950/40'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="truncate">
                      <p className="truncate leading-snug">{sess.title}</p>
                      <span className={`text-[9px] ${activeSession === sess.id ? 'text-blue-100' : 'text-gray-400'}`}>
                        {sess.timestamp}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar diagnostic telemetry details */}
          <div className="p-4 border-t border-[#E5E7EB] dark:border-gray-800 space-y-2">
            <div className="flex justify-between text-[10px] font-mono text-gray-400 dark:text-gray-500">
              <span>MODEL LAYER</span>
              <span className="text-blue-500 font-bold">VENTURE-GPTv4</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-400 dark:text-gray-500">
              <span>SYSTEM LATENCY</span>
              <span className="text-emerald-500">0.02ms</span>
            </div>
          </div>
        </aside>

        {/* COLUMN 2: CENTER CHAT DISPLAY FIELD */}
        <section className="flex-1 flex flex-col justify-between bg-[#F5F8FC] dark:bg-[#0E1118] relative overflow-hidden">
          {/* Bezel inner decorative glow */}
          <div className="absolute inset-0 bg-radial from-blue-50/10 to-transparent pointer-events-none"></div>

          {/* TOP CHAT HEADER CONTROL */}
          <div className="bg-white/80 dark:bg-[#11131E]/80 border-b border-gray-200/80 dark:border-gray-800/80 p-4 flex justify-between items-center z-10 backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <button
                onClick={onGoToDashboard}
                className="p-1.5 rounded bg-gray-50 dark:bg-gray-900 border text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white font-display">
                  Venture Co-Pilot Interface
                </h3>
                <p className="text-[10px] text-gray-400 font-mono">CHANNEL // MEDTECH-AI-DIAGNOSTICS</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-[10px]">DIAGNOSTIC STATUS: CLEAN</span>
            </div>
          </div>

          {/* MAIN MESSAGE DISPLAY (PROFESSIONAL EMPTY STATE ONBOARDING) */}
          <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
            
            {/* Elegant integrated Companion Robot welcome card */}
            <div className="max-w-2xl bg-white dark:bg-[#12141F] border border-gray-200/80 dark:border-gray-800/80 rounded-2xl p-8 shadow-sm space-y-6 text-center animate-fade-in">
              
              {/* Sleek Vector Robot Mascot Frame */}
              <div className="relative inline-flex p-1 rounded-2xl bg-gradient-to-b from-blue-500/10 to-transparent">
                <div className="relative h-24 w-24 rounded-xl border border-gray-150 dark:border-gray-850 bg-white dark:bg-[#151926] flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Digital screen style inside */}
                  <div className="relative w-14 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center space-y-1 shadow-inner">
                    {/* Glowing Eyes */}
                    <div className="flex space-x-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse"></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse delay-75"></span>
                    </div>
                    {/* Clean smile LED mouth */}
                    <div className="w-5 h-0.5 rounded-full bg-cyan-400/85"></div>
                    
                    {/* Ears receptors */}
                    <div className="absolute -left-1 w-0.5 h-3 bg-cyan-500 rounded-r"></div>
                    <div className="absolute -right-1 w-0.5 h-3 bg-cyan-500 rounded-l"></div>
                  </div>

                  {/* Body mount */}
                  <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700"></div>
                  <div className="w-8 h-2 rounded-full bg-slate-200 dark:bg-slate-850"></div>
                </div>

                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                  <Sparkles className="h-3 w-3" />
                </div>
              </div>

              {/* Onboarding text copy */}
              <div className="space-y-2">
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  Design, Refine & Scale with Venture AI Co-Pilot
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                  I am integrated to compile your sandbox drafts recursively. I map competitive metrics, outline market indexes, draft PDF layouts, and check investment parameters. Enter a command in the console to evaluate.
                </p>
              </div>

              {/* Grid of Starter System commands */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {starterPrompts.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => setInputText(p.title)}
                    className="p-3.5 border border-gray-100 hover:border-blue-300 dark:border-gray-800/80 dark:hover:border-blue-900 bg-gray-50/50 dark:bg-black/20 hover:bg-white dark:hover:bg-[#151926] rounded-xl text-left cursor-pointer transition-all relative group"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                        {p.title}
                      </span>
                      <span className="text-[9px] font-mono font-medium text-gray-400 group-hover:block hidden">
                        INVOKE
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-snug">{p.desc}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* CHAT INPUT AREA */}
          <div className="p-6 bg-white/80 dark:bg-[#11131E]/80 border-t border-gray-200/80 dark:border-gray-800/80 z-10 backdrop-blur-md">
            <div className="max-w-3xl mx-auto">
              <div className="relative flex items-center bg-[#F5F8FC] dark:bg-[#0A0D14] border border-gray-200 dark:border-gray-800 rounded-xl p-1.5 focus-within:border-blue-500/60 transition-all">
                <div className="flex items-center space-x-1 px-2.5">
                  <Bot className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                </div>
                
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Inquire AI Co-Pilot to map market variables..."
                  className="flex-1 text-xs text-slate-800 dark:text-white bg-transparent border-0 outline-none p-2"
                />

                <div className="flex items-center space-x-2 px-1">
                  <button className="bg-[#3B82F6] hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition-all duration-200" disabled>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Watermark feedback */}
              <p className="text-center text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-2">
                ASYNCHRONOUS RUNTIME READY // ENTERPRISE CONSOLE IS UI ONLY
              </p>
            </div>
          </div>

        </section>

        {/* COLUMN 3: RIGHT ASSISTANT CONTROL PANEL */}
        <aside className="w-72 border-l border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#11131E] p-5 hidden lg:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">
              <Cpu className="h-4 w-4 text-blue-500" />
              <span>Diagnostic Panel</span>
            </div>

            {/* Profile summary of target compile */}
            <div className="p-4 rounded-xl border border-gray-150 dark:border-gray-800 bg-[#F5F8FC]/50 dark:bg-[#0A0D14]/50 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 font-mono uppercase block">CURRENT CONTEXT</span>
                <p className="text-xs font-bold text-slate-800 dark:text-white">MedTech AI Diagnostics</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 font-mono uppercase block">LOADED SCHEMA</span>
                <p className="text-xs font-bold text-emerald-500 font-mono flex items-center space-x-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span>MED_DIAGNOSTICS_V1.json</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 font-mono uppercase block">CONSTRAINTS</span>
                <p className="text-xs text-gray-500 leading-tight">Strict Seed-Round TAM validation thresholds strictly active.</p>
              </div>
            </div>

            {/* Token memory logs metrics */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 font-mono uppercase block">MEMORY INTEGRATION</span>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-gray-500">Context Window</span>
                  <span className="text-blue-500 font-mono font-medium">12.5k / 128k</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="text-gray-500">Retrieval Embeddings</span>
                  <span className="text-indigo-500 font-mono font-medium">Synced</span>
                </div>
              </div>
            </div>

            {/* Venture audit checklist */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 font-mono uppercase block">AUDIT COMPLIANCE</span>
              <div className="space-y-2 text-[11px] text-gray-500">
                <div className="flex items-center space-x-1.5">
                  <Fingerprint className="h-3.5 w-3.5 text-blue-500" />
                  <span>IP boundaries audited (PASS)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Layers className="h-3.5 w-3.5 text-purple-400" />
                  <span>CAGR cohort index structured</span>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-150 dark:border-gray-800">
            <span className="text-[9.5px] text-gray-400 dark:text-gray-500 leading-snug font-mono block">
              CONSOLE COMPILER SECURED // ID: VNT-CORE-001
            </span>
          </div>
        </aside>

      </div>

    </div>
  );
}
