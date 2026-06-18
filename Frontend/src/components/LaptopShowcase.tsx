/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, ShieldCheck, TrendingUp, Search, CheckCircle2, ChevronRight, 
  Activity, ArrowRight, Play, Pause, RefreshCw, BarChart3, Database, Scale, Briefcase
} from 'lucide-react';

interface LaptopShowcaseProps {
  theme?: 'light' | 'dark';
}

export default function LaptopShowcase({ theme = 'light' }: LaptopShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [step, setStep] = useState(0); // 0 (typing), 1 (ai replying), 2 (market), 3 (competitor), 4 (finance), 5 (compliance), 6 (recommendation), 7 (completed pause)
  const [typedUserMsg, setTypedUserMsg] = useState('');
  const [typedAiReply, setTypedAiReply] = useState('');
  
  const reportScrollRef = useRef<HTMLDivElement>(null);
  
  const founderPrompt = "We are building an enterprise legal risk intelligence platform for start-ups. Can you run a complete venture feasibility analysis on state regulatory safeguards, competitive defensibility, and pre-seed SaaS metrics?";
  
  const analystIntro = "Feasibility study initiated. Sourcing municipal/state registration databases, indexing state UPL statutes, and calibrating high-margin pre-seed operational economic models... Establishing core Strategy Workspace...";

  // Reset/Restart the demo smoothly
  const resetDemo = () => {
    setStep(0);
    setTypedUserMsg('');
    setTypedAiReply('');
    if (reportScrollRef.current) {
      reportScrollRef.current.scrollTop = 0;
    }
  };

  // State Machine Sequencer with auto-looping
  useEffect(() => {
    if (!isPlaying) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (step === 0) {
      // Type Founder Message
      if (typedUserMsg.length < founderPrompt.length) {
        timer = setTimeout(() => {
          setTypedUserMsg(founderPrompt.slice(0, typedUserMsg.length + 2));
        }, 8);
      } else {
        // Show sent state, transition to thinking
        timer = setTimeout(() => {
          setStep(1);
        }, 1200);
      }
    } else if (step === 1) {
      // Type Analyst Response
      if (typedAiReply.length < analystIntro.length) {
        timer = setTimeout(() => {
          setTypedAiReply(analystIntro.slice(0, typedAiReply.length + 3));
        }, 6);
      } else {
        // Connect and generate report
        timer = setTimeout(() => {
          setStep(2);
        }, 1500);
      }
    } else if (step >= 2 && step <= 6) {
      // Progressive build sections (2 to 6)
      const sectionDelays: Record<number, number> = {
        2: 4500, // Section 1: Market sizing
        3: 4500, // Section 2: Competitors
        4: 4500, // Section 3: Yield calculations
        5: 4500, // Section 4: Safe Harbor Compliance
        6: 6000  // Section 5: Advisory / Sequoia thesis
      };
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, sectionDelays[step]);
    } else if (step === 7) {
      // Completed, pause for 7s so reader absorbs the final compiled state, then auto-restart
      timer = setTimeout(() => {
        resetDemo();
      }, 7500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step, typedUserMsg, typedAiReply, isPlaying]);

  // Smooth autoscroll inside report view
  useEffect(() => {
    if (reportScrollRef.current) {
      const el = reportScrollRef.current;
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [step]);

  const isDark = theme === 'dark';

  // Light Mode & Dark Mode Contrast Palettes (AA Compliant & Enterprise layout)
  const textPrimary = isDark ? 'text-[#FAFAFA]' : 'text-[#111827]';
  const textSecondary = isDark ? 'text-[#A3A3A3]' : 'text-[#1F2937]';
  const textMuted = isDark ? 'text-[#737373]' : 'text-[#374151]';
  const textDeepMuted = isDark ? 'text-[#737373]' : 'text-[#4B5563]';
  const borderCol = isDark ? 'border-[#262626]' : 'border-[#CBD5E1]';
  const borderLight = isDark ? 'border-[#2E2E2E]' : 'border-[#E2E8F0]';
  const chatBg = isDark ? 'bg-[#111111]' : 'bg-[#F8FAFC]';
  const reportBg = isDark ? 'bg-[#050505]' : 'bg-[#FFFFFF]';
  const rawBg = isDark ? 'bg-[#111111]' : 'bg-[#F1F5F9]';
  const cardInnerBg = isDark ? 'bg-[#171717] border border-[#262626]' : 'bg-[#F8FAFC]';

  return (
    <div className="relative w-full px-2" id="laptop_showcase_stage">
      {/* LAPTOP HOVER & VIEW CONTAINER: FLOWING DIRECTLY UNDER HERO */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* LAPTOP SCREEN FRAME */}
        <div className="relative w-full aspect-[16/10.1] rounded-t-2xl border-[8px] md:border-[10px] border-neutral-800 bg-[#161617] shadow-2xl p-0.5 overflow-hidden">
          {/* Outer gloss highlight */}
          <div className="absolute inset-0 border border-neutral-900/80 rounded-[8px] pointer-events-none z-20"></div>

          {/* Web Cam indicator */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-950 flex items-center justify-center z-30">
            <div className="w-0.5 h-0.5 rounded-full bg-blue-500 animate-pulse"></div>
          </div>

          {/* APP SCREEN */}
          <div className={`w-full h-full rounded-[4px] overflow-hidden flex flex-col relative ${reportBg} transition-colors duration-300`}>
            
            {/* Top Workspace Header */}
            <div className={`flex h-10.5 items-center justify-between px-4 border-b ${borderCol} ${isDark ? 'bg-[#111111]' : 'bg-[#F1F5F9]'} z-20`}>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>

              <div className={`flex items-center space-x-1.5 ${isDark ? 'bg-[#050505]/40 text-[#737373]' : 'bg-white text-slate-700'} border ${borderCol} px-4 py-1 rounded-md text-[10px] md:text-[11px] font-mono tracking-tight w-2/5 justify-center`}>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="truncate">workspace://strategy-workspace</span>
              </div>

              {/* Seamless Action & Manual Override Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                    isPlaying ? 'bg-blue-600/10 text-blue-600 hover:bg-blue-600/20' : 'bg-amber-600/10 text-amber-600'
                  }`}
                  title={isPlaying ? "Click to Pause" : "Click to Play"}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-2.5 w-2.5" />
                      <span className="hidden sm:inline">Active</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-2.5 w-2.5" />
                      <span>Paused</span>
                    </>
                  )}
                </button>
                <button
                  onClick={resetDemo}
                  className={`p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-all cursor-pointer`}
                  title="Force Restart Simulation"
                >
                  <RefreshCw className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

            {/* SPLIT CORES SCREEN */}
            <div className="flex-1 flex overflow-hidden relative">
              
              {/* LEFT COLUMN: SOURCE COGNITIVE PANE (40% Width) */}
              <div className={`w-[38%] border-r ${borderCol} flex flex-col justify-between p-4 ${chatBg} transition-colors duration-300 relative`}>
                
                {/* Dialogue state parameters */}
                <div className={`flex items-center justify-between pb-3.5 border-b ${borderLight}`}>
                  <div className="flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-blue-500" />
                    <span className={`text-[10px] md:text-xs font-bold tracking-tight uppercase ${textSecondary}`}>
                      Research Engine
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] font-bold text-emerald-500 uppercase">Live Pipeline</span>
                  </div>
                </div>

                {/* Flowing dialogue messages */}
                <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-none">
                  
                  {/* Founder prompt types out */}
                  {typedUserMsg && (
                    <div className="flex flex-col items-end">
                      <div className="max-w-[95%] bg-blue-600 text-white px-3.5 py-3 rounded-2xl text-[11px] md:text-xs leading-relaxed font-semibold shadow-sm text-left">
                        {typedUserMsg}
                        {step === 0 && (
                          <span className="inline-block w-1.5 h-3.5 bg-white ml-0.5 animate-pulse" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Analyst responding */}
                  {step >= 1 && (
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 h-4.5 w-4.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                        V
                      </div>
                      <div className={`p-3 rounded-2xl text-[11px] md:text-xs leading-relaxed max-w-[90%] font-medium ${isDark ? 'bg-[#171717] text-[#A3A3A3] border border-[#262626]' : 'bg-white text-slate-800 border border-slate-200'} shadow-sm text-left`}>
                        {step === 1 ? typedAiReply : analystIntro}
                        {step === 1 && (
                          <span className="inline-block w-1.5 h-3.5 bg-blue-500 ml-0.5 animate-pulse" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Progressive Pipeline statuses during generation */}
                  {step >= 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`space-y-2 pt-2 border-t ${isDark ? 'border-[#2E2E2E]' : 'border-slate-200/50'}`}
                    >
                      <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest block ${textDeepMuted}`}>
                        Pipeline Activity Log
                      </span>
                      
                      <div className="space-y-1.5 font-mono text-[9px] md:text-[10px] text-left">
                        <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                          <span>✓</span>
                          <span>Indexed 50 States Registration Statutes</span>
                        </div>
                        {step >= 3 ? (
                          <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                            <span>✓</span>
                            <span>Synthesized Competitor Retainers</span>
                          </div>
                        ) : step === 2 ? (
                          <div className="flex items-center gap-2 text-blue-500 animate-pulse font-semibold">
                            <ul>
                              <li className="list-disc ml-4">Evaluating SaaS Tier pricing...</li>
                            </ul>
                          </div>
                        ) : null}

                        {step >= 4 ? (
                          <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                            <span>✓</span>
                            <span>Simulated Year-1 Multi-Tier Economics</span>
                          </div>
                        ) : step === 3 ? (
                          <div className="flex items-center gap-2 text-blue-500 animate-pulse font-semibold">
                            <ul>
                              <li className="list-disc ml-4">Calibrating Growth trajectories...</li>
                            </ul>
                          </div>
                        ) : null}

                        {step >= 5 ? (
                          <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                            <span>✓</span>
                            <span>Isolated Practice of Law safeguards</span>
                          </div>
                        ) : step === 4 ? (
                          <div className="flex items-center gap-2 text-blue-500 animate-pulse font-semibold">
                            <ul>
                              <li className="list-disc ml-4">Validating Delaware Safe Harbors...</li>
                            </ul>
                          </div>
                        ) : null}

                        {step >= 6 && (
                          <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                            <span>✓</span>
                            <span>Investment Dossier Fully Compiled</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                </div>

                {/* Input slot mimic */}
                <div className={`mt-2 border ${borderCol} rounded-xl p-2.5 flex items-center justify-between ${isDark ? 'bg-zinc-950/60' : 'bg-white'} shadow-sm`}>
                  <div className="flex items-center space-x-2 pl-1.5 flex-1 overflow-hidden">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className={`text-[10px] md:text-xs truncate ${textDeepMuted}`}>
                      {step === 0 ? "Analyzing requirements..." : "Enter additional metrics... (Auto)"}
                    </span>
                  </div>
                  <ChevronRight className={`h-4 w-4 ${textDeepMuted}`} />
                </div>
              </div>

              {/* RIGHT COLUMN: MCKINSEY-LEVEL VENTURE INTEL BRIEF (62% Width) */}
              <div 
                ref={reportScrollRef}
                className={`w-[62%] p-5 md:p-6 overflow-y-auto ${reportBg} scrollbar-thin transition-colors duration-300 text-left`}
                id="laptop_report_viewport"
              >
                {step < 2 ? (
                  /* Professional blank intake dashboard waiting to draw */
                  <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                      className="p-3 bg-blue-500/5 rounded-full"
                    >
                      <Scale className="h-8 w-8 text-blue-500/35" />
                    </motion.div>
                    <div className="text-center space-y-1">
                      <h4 className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>
                        Strategy Workspace
                      </h4>
                      <p className={`text-[10px] md:text-11px font-mono ${textDeepMuted}`}>
                        {step === 0 ? "Awaiting founder intake confirmation..." : "Locking parameters. Initializing research models..."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 pb-10">
                    
                    {/* LEADING METRICS SUMMARY PANEL */}
                    <div className={`border-b ${borderCol} pb-4`}>
                      <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-widest">
                        <Scale className="h-3.5 w-3.5" />
                        <span>Investment Review Dossier</span>
                      </div>
                      <h3 className={`text-base md:text-xl font-extrabold tracking-tight mt-1 ${textPrimary}`}>
                        VENTURE FEASIBILITY EXECUTIVE BRIEF
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-[10px] font-mono ${textMuted}`}>
                          DEEP COMPLIANCE & UNIT ECONOMICAL DIAGNOSTIC
                        </span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded font-extrabold uppercase">
                          Rating: Strong Outperform
                        </span>
                      </div>
                    </div>

                    {/* PROGRESS BAR TIMELINE */}
                    <div className={`bg-neutral-50 dark:bg-[#111111] border ${borderLight} rounded-xl p-3 flex justify-between items-center text-[9px] font-bold font-mono tracking-tight`}>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#3B82F6] animate-pulse" />
                        <span className={textSecondary}>PHASE {step - 1} / 5</span>
                      </div>
                      <div className="flex gap-4">
                        <span className={step >= 2 ? "text-emerald-500" : textDeepMuted}>1. FEASIBILITY</span>
                        <span className={step >= 3 ? "text-emerald-500" : textDeepMuted}>2. LANDSCAPE</span>
                        <span className={step >= 4 ? "text-emerald-500" : textDeepMuted}>3. ECONOMICS</span>
                        <span className={step >= 5 ? "text-emerald-500" : textDeepMuted}>4. STATUTES</span>
                      </div>
                    </div>

                    {/* SECTION 1: MARKET INTELLIGENCE & ADJACENCY SIZING */}
                    {step >= 2 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-3.5"
                      >
                        <h4 className={`text-xs md:text-sm font-extrabold flex items-center gap-2 ${textPrimary} uppercase tracking-tight border-l-3 border-blue-500 pl-2.5`}>
                          1. Market Intelligence & Latent Volume
                        </h4>
                        
                        <p className={`text-xs leading-relaxed ${textSecondary} font-normal`}>
                          The startup legal advisory landscape is locked within highly classical bottlenecks. Individual practitioners operate on strict billing curves averaging <strong>$450/hour</strong>. This completely pricing-excludes <strong>86%</strong> of pre-seed agencies, emerging founders, and scaling digital operators who choose to draft agreements blindly or neglect foundational filings.
                        </p>
                        
                        <p className={`text-xs leading-relaxed ${textSecondary} font-normal`}>
                          A dedicated Strategy Workspace captures this massive unserved demand by automating transactional statutory drafts, ensuring robust, predictable compliance models at an execution fraction of traditional fees.
                        </p>

                        {/* Interactive TAM Chart */}
                        <div className={`p-4 rounded-xl border ${borderLight} ${cardInnerBg} space-y-3`}>
                          <span className={`text-[10px] font-bold block uppercase tracking-wider ${textMuted}`}>
                            Addressable Legal Spend Recovery Model (TAM)
                          </span>
                                            <div className="space-y-3 pt-1">
                            <div>
                              <div className="flex justify-between text-[10px] font-bold mb-1">
                                <span className={textSecondary}>Unserved Start-up Spend (Latent TAM)</span>
                                <span className="text-[#3B82F6] font-extrabold">$4.80 Billion</span>
                              </div>
                              <div className={`h-2.5 w-full bg-slate-200/80 dark:bg-[#111111] rounded-full overflow-hidden`}>
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "88%" }}
                                  transition={{ duration: 1.2, ease: "easeOut" }}
                                  className="h-full bg-[#3B82F6] rounded-full"
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-[10px] font-bold mb-1">
                                <span className={textSecondary}>Target Self-Serve Subscription SAM</span>
                                <span className="text-[#3B82F6] font-extrabold">$1.20 Billion</span>
                              </div>
                              <div className={`h-2.5 w-full bg-slate-200/80 dark:bg-[#111111] rounded-full overflow-hidden`}>
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: "45%" }}
                                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                                  className="h-full bg-[#3B82F6] rounded-full"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* SECTION 2: COMPETITIVE POSITION / DEFENSIVE PRICING MOAT */}
                    {step >= 3 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3.5 pt-4 border-t border-slate-200/70 dark:border-zinc-800/80"
                      >
                        <h4 className={`text-xs md:text-sm font-extrabold flex items-center gap-2 ${textPrimary} uppercase tracking-tight border-l-3 border-blue-500 pl-2.5`}>
                          2. Defensive Moat & Landscape Alignment
                        </h4>
                        
                        <p className={`text-xs leading-relaxed ${textSecondary} font-normal`}>
                          Existing enterprise platforms (e.g., Harvey.ai, Ironclad) focus premium resources solely on enterprise legal divisions or global conglomerates. They utilize intensive, long sales pilots with minimum yearly commitments in the range of <strong>$50k</strong>, ignoring the high-velocity founder completely.
                        </p>

                        {/* Defensibility Matrix Table */}
                        <div className={`overflow-hidden border ${borderLight} rounded-xl ${cardInnerBg}`}>
                          <div className={`grid grid-cols-4 p-2.5 text-[9px] md:text-[10px] font-extrabold uppercase ${isDark ? 'bg-[#111111]' : 'bg-neutral-100/50'} text-slate-500 dark:text-[#737373] border-b ${borderLight}`}>
                            <span>Segment Player</span>
                            <span>Annual Tier</span>
                            <span>SME Friction</span>
                            <span>Core Focus</span>
                          </div>
                          
                          <div className={`divide-y ${isDark ? 'divide-[#2E2E2E]' : 'divide-slate-100'} text-xs text-left`}>
                            <div className="grid grid-cols-4 p-2.5 font-medium">
                              <span className={textSecondary}>Practitioner Hours</span>
                              <span className="font-bold text-[#E11D48]">$45,000+</span>
                              <span className="text-[#E11D48] font-bold">100% Critical</span>
                              <span className={textMuted}>Bespoke advice</span>
                            </div>
                            <div className="grid grid-cols-4 p-2.5 font-medium">
                              <span className={textSecondary}>Harvey AI</span>
                              <span className="font-bold text-amber-500">$12,000+</span>
                              <span className="text-amber-500 font-bold">85% High</span>
                              <span className={textMuted}>Enterprise legal</span>
                            </div>
                            <div className={`grid grid-cols-4 p-2.5 ${isDark ? 'bg-[#3B82F6]/5 text-[#3B82F6]' : 'bg-blue-500/5 text-blue-600'} font-extrabold`}>
                              <span>Strategy Workspace</span>
                              <span>$348/yr</span>
                              <span className="text-emerald-500 text-[10px] font-black uppercase">0% Self-Serve</span>
                              <span className={isDark ? 'text-[#FAFAFA]' : 'text-[#1F2937]'}>Velocity founders</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* SECTION 3: SAAS ECONOMICS / PROJECTIVE ANALYSIS */}
                    {step >= 4 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`space-y-4 pt-4 border-t ${isDark ? 'border-[#2E2E2E]' : 'border-slate-200/70'}`}
                      >
                        <h4 className={`text-xs md:text-sm font-extrabold flex items-center gap-2 ${textPrimary} uppercase tracking-tight border-l-3 border-[#3B82F6] pl-2.5`}>
                          3. SaaS Economics & Yield Forecasting
                        </h4>

                        <p className={`text-xs leading-relaxed ${textSecondary} font-normal`}>
                          By leveraging serverless vector nodes, our processing raw computational expenses remain minimal, establishing an exceptional <strong>94.6% gross margin</strong>. High Customer Lifetime Value (LTV) models to <strong>$1,450</strong> with a low acquisition threshold of <strong>$38.20</strong>, producing an incredibly healthy LTV:CAC ratio.
                        </p>

                        {/* Financial metric grid */}
                        <div className="grid grid-cols-4 gap-2.5">
                          {[
                            { title: "Target Yr-1 ARR", value: "$1.98M", change: "+14.3%", color: isDark ? "text-[#3B82F6]" : "text-blue-600" },
                            { title: "Gross Margin", value: "94.6%", change: "Optimized", color: "text-emerald-500" },
                            { title: "LTV Target", value: "$1,450", change: "Secure", color: isDark ? "text-[#3B82F6]" : "text-blue-600" },
                            { title: "CAC Target", value: "$38.20", change: "-2.4%", color: isDark ? "text-[#FAFAFA]" : "text-slate-800" }
                          ].map((kpi, kIdx) => (
                            <div key={kIdx} className={`p-3 rounded-xl border ${borderLight} ${cardInnerBg} space-y-1`}>
                              <span className={`text-[8px] md:text-[9.5px] font-extrabold uppercase tracking-widest block ${textDeepMuted}`}>
                                {kpi.title}
                              </span>
                              <h5 className={`text-xs md:text-sm font-extrabold leading-none ${kpi.color}`}>
                                {kpi.value}
                              </h5>
                              <span className="text-[8px] font-mono text-zinc-500 font-bold block uppercase">{kpi.change}</span>
                            </div>
                          ))}
                        </div>

                        {/* Interactive dynamic chart */}
                        <div className={`p-4 rounded-xl border ${borderLight} ${cardInnerBg} space-y-3`}>
                          <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-bold block uppercase tracking-wider ${textMuted}`}>
                              12-Month ARPU Projected Curve
                            </span>
                            <span className="text-[9px] font-bold text-emerald-500 font-mono tracking-widest uppercase">
                              9.2% MoM Compounding
                            </span>
                          </div>

                          <div className="h-20 w-full relative pt-2">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" fill="none">
                              <line x1="0" y1="15" x2="200" y2="15" stroke={isDark ? "#2E2E2E" : "#E2E8F0"} strokeWidth="0.5" strokeDasharray="3,3" />
                              <line x1="0" y1="45" x2="200" y2="45" stroke={isDark ? "#2E2E2E" : "#E2E8F0"} strokeWidth="0.5" strokeDasharray="3,3" />
                              
                              <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.4, ease: "easeOut" }}
                                d="M0,58 C42,54 84,40 126,24 C168,8 184,3 200,1" 
                                stroke="#3B82F6" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                              />
                              <motion.path 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.12 }}
                                transition={{ duration: 1, delay: 0.3 }}
                                d="M0,58 C42,54 84,40 126,24 C168,8 184,3 200,1 L200,60 L0,60 Z" 
                                fill="#3B82F6" 
                              />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* SECTION 4: PRACTICE OF LAW EXCLUSION AND STATUTES */}
                    {step >= 5 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`space-y-4 pt-4 border-t ${isDark ? 'border-[#2E2E2E]' : 'border-slate-200/70'}`}
                      >
                        <h4 className={`text-xs md:text-sm font-extrabold flex items-center gap-2 ${textPrimary} uppercase tracking-tight border-l-3 border-[#3B82F6] pl-2.5`}>
                          4. Statutory Safe-Harbors & Legal Shield
                        </h4>

                        <p className={`text-xs leading-relaxed ${textSecondary} font-normal`}>
                          Regulatory guidelines governing state-level Unauthorized Practice of Law (UPL) mandates require clear architectural boundaries. Our platform operates entirely outside practice-of-law liability thresholds by structuring outputs exclusively as <strong>interactive contract risk checklists</strong> with a mandatory human founder oversight checkpoint.
                        </p>

                        {/* Interactive Checklist checks in real time */}
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { title: "Retrieval Document Isolation", status: "SOC-2 Standard", check: true },
                            { title: "UPL Liability Shielding Rules", status: "Zero Practitioner Liability", check: true },
                            { title: "Delaware statutory mapping", status: "Corporate Series LLC verified", check: true },
                            { title: "NY Secretary of State clearance", status: "Filing criteria locked", check: true }
                          ].map((check, cIdx) => (
                            <div key={cIdx} className={`p-3 rounded-xl border ${borderLight} ${cardInnerBg} flex items-start gap-3`}>
                              <span className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">
                                ✓
                              </span>
                              <div className="space-y-0.5 text-left">
                                <span className={`text-[10px] md:text-xs font-bold block ${textSecondary}`}>
                                  {check.title}
                                </span>
                                <span className={`text-[9px] font-mono block ${textDeepMuted}`}>
                                  {check.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* SECTION 5: RECOMMENDATION - MCKINSEY INVESTMENT THESIS APPROVED */}
                    {step >= 6 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`space-y-4 pt-4 border-t ${isDark ? 'border-[#2E2E2E]' : 'border-slate-200/70'}`}
                      >
                        <h4 className={`text-xs md:text-sm font-extrabold flex items-center gap-2 ${textPrimary} uppercase tracking-tight border-l-3 border-[#3B82F6] pl-2.5`}>
                          5. Strategic Venture Clearance & Roadmap
                        </h4>

                        <p className={`text-xs leading-relaxed ${textSecondary} font-normal`}>
                          The Strategy Workspace isolated indicators demonstrate a stellar pre-seed opportunity profile: structural scalability, compounding subscription MRR channels, and a complete regulatory defense envelope.
                        </p>

                        {/* SEQUOIA STYLE DECISION CARD with gold accent */}
                        <motion.div 
                          initial={{ scale: 0.98, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className={`bg-[#3B82F6]/5 dark:bg-[#3B82F6]/10 border-2 border-[#3B82F6]/30 rounded-2xl p-4 md:p-5 text-left space-y-2.5 relative overflow-hidden`}
                        >
                          <div className="absolute top-0 right-0 bg-[#3B82F6] text-white font-mono text-[8px] md:text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                            ADVISORY BRIEF LOCK
                          </div>
                          
                          <div className="flex items-center gap-2 text-[#3B82F6]">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-[10px] md:text-xs font-black tracking-widest uppercase">
                              Primary Tactical Directive
                            </span>
                          </div>

                          <h5 className={`text-xs md:text-sm font-extrabold ${textPrimary}`}>
                            LOI Capital Generation Roadmap
                          </h5>

                          <p className={`text-[11px] md:text-xs leading-relaxed ${textSecondary} font-medium`}>
                            Deploy gated private invitations immediately to 15 accelerator cohorts to capture early Letters of Intent (LOIs). Establish integration partnerships with Delaware registrations registers, leveraging compliance archives as a direct GTM user funnel.
                          </p>
                        </motion.div>
                      </motion.div>
                    )}

                  </div>
                )}
              </div>

            </div>

            {/* Simulated Desktop Bottom Bar */}
            <div className={`h-8 border-t ${borderCol} ${isDark ? 'bg-[#111111]' : 'bg-[#F1F5F9]'} flex items-center justify-between px-4 text-[9px] md:text-[10px] text-zinc-500 z-20`}>
              <div className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className={`font-mono font-bold tracking-tight uppercase ${textDeepMuted}`}>
                  {step === 0 ? "COGNITIVE PIPELINE IDLE" : "VENTURE ASSESSMENT ACTIVE"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-mono text-[9px] ${textDeepMuted}`}>
                  {step === 7 ? 'REPORT SYNTHESIS REVIEWS FINISHED' : `SECTION: ${step === 0 ? '0' : step - 1} / 5`}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Mac-style Display stand keyboard integration chassis base */}
        <div className="relative mx-auto w-full h-3 md:h-4 bg-neutral-800 rounded-b-xl border-t border-neutral-700 shadow-xl z-15 flex items-center justify-center">
          <div className="w-16 md:w-24 h-1 bg-neutral-900 rounded-b" />
        </div>

      </div>
    </div>
  );
}
