/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion , AnimatePresence} from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, Search, TrendingUp, ShieldCheck, FileText, 
  Activity, CheckCircle2, ChevronRight
} from 'lucide-react';

interface FeatureShowcaseProps {
  theme?: "light" | "dark";
}

interface FeatureItem {
  id: number;
  label: string;
  tagline: string;
  title: string;
  description: string;
  bullets: string[];
}

// Highly reliable typewriter component to keep screens feeling active
function Typewriter({ 
  text, 
  delay = 20, 
  onComplete 
}: { 
  text: string; 
  delay?: number; 
  onComplete?: () => void 
}) {
  const [displayed, setDisplayed] = useState('');
  const textRef = useRef(text);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    textRef.current = text;
    onCompleteRef.current = onComplete;
  }, [text, onComplete]);

  useEffect(() => {
    let index = 0;
    setDisplayed('');

    const timer = setInterval(() => {
      index += 1;
      const currentText = textRef.current;
      setDisplayed(currentText.slice(0, index));
      if (index >= currentText.length) {
        clearInterval(timer);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, delay);

    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      <span className="inline-block w-1.5 h-1.5 bg-blue-500 animate-pulse ml-0.5 align-middle" />
    </span>
  );
}

export default function FeatureShowcase({
  theme = "light",
}: FeatureShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  // Substage progression counters for the operating app dashboards
  const [laptopSubstep, setLaptopSubstep] = useState(0);

  // 5 Strategic validation chapters
  const features: FeatureItem[] = [
    {
      id: 0,
      label: "Market Validation",
      tagline: "01 / MARKET FEASIBILITY",
      title: "Synthesize target customer demographics",
      description: "Map latent volume and query state-level startup registration archives in seconds. Determine market size, localize capital pools, and unearth underserved niches before moving resources.",
      bullets: [
        "Dynamic TAM / SAM / SOM projection charts",
        "Target audience demographic profile blueprints",
        "Latent unserved dollar spend calculations"
      ]
    },
    {
      id: 1,
      label: "Competitor Intelligence",
      tagline: "02 / COMPETITIVE ALIGNMENT",
      title: "Isolate feature gaps and price defenses",
      description: "Assemble alignment matrices comparing legacy retainers, corporate consultancies, and digital workspaces. Benchmark defensibility metrics easily.",
      bullets: [
        "Synthesized competitor matrix tracking major providers",
        "Moat assessment checklists against market incumbents",
        "Pricing tier maps identifying margin vulnerabilities"
      ]
    },
    {
      id: 2,
      label: "Revenue Modeling",
      tagline: "03 / ECONOMIC PROJECTIONS",
      title: "Formulate compounding SaaS metrics",
      description: "Balance pricing grids and draft transparent growth multipliers. Automatically calculate lifetime value (LTV), acquisition cost (CAC), and payback limits.",
      bullets: [
        "12-month MRR and compounding run-rate curves",
        "Durable unit economics calculators (LTV:CAC)",
        "Pre-seed capital burn and gross margin estimators"
      ]
    },
    {
      id: 3,
      label: "GTM Strategy",
      tagline: "04 / BUSINESS DEPLOYMENT",
      title: "Document scalable strategic sprints",
      description: "Craft complete investor briefs and Go-To-Market playbooks. Align legal disclaimers, Series-LLC profiles, and compliance registries systematically.",
      bullets: [
        "Professional Markdown executive summaries",
        "Partnership and registrar distribution roadmaps",
        "Downloadable briefs formatted for validation"
      ]
    },
    {
      id: 4,
      label: "Investor Readiness",
      tagline: "05 / VENTURE SCORECARD",
      title: "Lock down compliance risk ratings",
      description: "Run final pre-seed compliance audits to ensure robust corporate Series filings and exclude Unauthorized Practice of Law UPL risks safely.",
      bullets: [
        "Interactive VC readiness scores and rating gauges",
        "Delaware, NY, and CA statutory checking ledgers",
        "SOC-2 data insulation and compliance certificates"
      ]
    }
  ];

  // Bulletproof IntersectionObserver to track scroll state dynamically
  useEffect(() => {
    const observers = features.map((_, index) => {
      const el = document.getElementById(`feature-section-${index}`);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        {
          root: null,
          rootMargin: '-35% 0px -35% 0px', // Trigger when section is in active center
          threshold: 0.1
        }
      );
      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.disconnect();
      });
    };
  }, []);

  // Sync animation substeps for the active laptop screen view
  useEffect(() => {
    setLaptopSubstep(0);
    const t1 = setTimeout(() => setLaptopSubstep(1), 900);
    const t2 = setTimeout(() => setLaptopSubstep(2), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeIndex]);

  const isDark = theme === 'dark';

  // Contrast Palettes (Complies with 4.5:1 AA ratio & Enterprise-grade styling)
  const hostScreenBg = isDark ? 'bg-[#050505] text-[#FAFAFA]' : 'bg-white text-[#0F172A]';
  const browserBarBg = isDark ? 'bg-[#111111] border-[#262626]' : 'bg-[#F1F5F9] border-[#E2E8F0]';
  const borderCol = isDark ? 'border-[#262626]' : 'border-[#E2E8F0]';
  const cardBg = isDark ? 'bg-[#171717] border-[#262626]' : 'bg-[#FAFCFE] border-[#E2E8F0]';
  const textMuted = isDark ? 'text-[#737373]' : 'text-[#475569]';
  const textPrimary = isDark ? 'text-[#FAFAFA]' : 'text-[#0F172A]';

  // Circle Gauge SVG Renderer
  const renderCircleGauge = (value: number, active: boolean) => {
    const radius = 32;
    const strokeWidth = 5;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke={isDark ? "#262626" : "#E2E8F0"}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke="#3B82F6"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: active ? offset : circumference }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeLinecap="round"
          />
        </svg>
        <span className={`absolute text-[10px] font-black ${isDark ? 'text-[#FAFAFA]' : 'text-[#0F172A]'}`}>
          {value}%
        </span>
      </div>
    );
  };

  // 1. Screen view 0: Market Validation & TAM Sizing
  const renderMarketValidation = (substep = laptopSubstep) => {
    return (
      <div className="w-full h-full p-3.5 md:p-5 flex flex-col justify-between overflow-y-auto select-none">
        <div className={`flex justify-between items-center border-b ${borderCol} pb-2`}>
          <div className="flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tight ${textPrimary}`}>
              Market Validation Desk
            </span>
          </div>
          <span className={`text-[7px] md:text-[7.5px] font-mono ${isDark ? 'bg-[#111111] text-[#3B82F6] border border-[#262626]' : 'bg-[#3B82F6]/10 text-blue-600'} px-2.5 py-0.5 rounded font-bold uppercase`}>
            REGISTRY SYNC
          </span>
        </div>

        <div className="space-y-3.5 my-2">
          {/* Active Query Chat */}
          <div className={`p-2.5 rounded-xl border ${cardBg} text-[9px] md:text-[10px] font-medium leading-relaxed shadow-sm`}>
            <div className="flex justify-between items-center text-[7px] font-black uppercase text-[#3B82F6] tracking-wider mb-1">
              <span>RESEARCH PIPELINE INTAKE</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6]/70 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3B82F6]"></span>
              </span>
            </div>
            <p className={`font-mono ${isDark ? 'text-[#CBD5E1]' : 'text-slate-800'}`}>
              Founder: &nbsp;
              <Typewriter text="Validate TAM and unserved margins for AI legal copilot" delay={15} />
            </p>
          </div>

          {/* Operation indicators */}
          {substep >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-2.5 rounded-xl border ${cardBg} text-[8px] md:text-[9.5px] space-y-1`}
            >
              <span className={`text-[7px] font-bold uppercase tracking-widest ${isDark ? 'text-[#737373]' : 'text-[#3B82F6]'} block`} >
                SYSTEM CALIBRATING LOG
              </span>
              <p className={`font-mono ${isDark ? 'text-[#737373]' : 'text-slate-500'} leading-relaxed text-left`}>
                ▶ Aggregating 50 states statutory registries... Done<br />
                ▶ Correlating corporate retainer fee indexes... Projected TAM compiled.
              </p>
            </motion.div>
          )}
        </div>

        {/* Markets projections charts */}
        {substep >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`space-y-2 border-t border-dashed ${isDark ? 'border-[#2E2E2E]' : 'border-slate-200'} pt-2`}
          >
            <div className="grid grid-cols-2 gap-2.5">
              <div className={`p-2.5 rounded-xl border ${cardBg} space-y-1`}>
                <span className={`text-[7px] md:text-[8px] font-extrabold uppercase ${isDark ? 'text-[#737373]' : 'text-slate-505'} block`}>
                  LATENT TAM RECOVERY
                </span>
                <span className={`text-xs md:text-sm font-black ${textPrimary} font-mono block`}>
                  $4.80 Billion
                </span>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#111111]' : 'bg-slate-200'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1 }}
                    className="h-full bg-[#3B82F6] rounded-full"
                  />
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border ${cardBg} space-y-1`}>
                <span className={`text-[7px] md:text-[8px] font-extrabold uppercase ${isDark ? 'text-[#737373]' : 'text-slate-505'} block`}>
                  SUBSCRIPTION SAM
                </span>
                <span className={`text-xs md:text-sm font-black ${isDark ? 'text-[#3B82F6]' : 'text-blue-500'} font-mono block`}>
                  $1.20 Billion
                </span>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#111111]' : 'bg-slate-200'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "45%" }}
                    transition={{ duration: 1, delay: 0.15 }}
                    className="h-full bg-[#3B82F6] rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // 2. Screen view 1: Competitor Intelligence
  const renderCompetitorIntelligence = (substep = laptopSubstep) => {
    return (
      <div className="w-full h-full p-3.5 md:p-5 flex flex-col justify-between overflow-y-auto select-none">
        <div className={`flex justify-between items-center border-b ${borderCol} pb-2`}>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tight ${textPrimary}`}>
              Competitive Moat Matrix
            </span>
          </div>
          <span className={`text-[7px] md:text-[7.5px] font-mono ${isDark ? 'bg-[#111111] text-[#A3A3A3] border border-[#262626]' : 'bg-yellow-500/10 text-yellow-600'} px-2.5 py-0.5 rounded font-bold uppercase`}>
            MAPPING ACTIVE
          </span>
        </div>

        <div className="flex-1 my-2 flex flex-col justify-center space-y-3">
          {/* Query block */}
          <div className={`p-2 rounded-xl border ${cardBg} text-[9px] ${isDark ? 'bg-[#111111] border-[#262626] text-[#A3A3A3]' : 'bg-slate-50 border-[#E2E8F0] text-slate-705'}`}>
            <span className={`text-[7px] font-bold ${isDark ? 'text-[#737373]' : 'text-yellow-655'} uppercase tracking-wider block mb-0.5`}>BENCHMARK INPUT</span>
            <p className="italic font-mono">
              "Isolate feature metrics vs. Harvey, Clio, Casetext..."
            </p>
          </div>

          {/* Matrix table */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border ${borderCol} rounded-xl overflow-hidden ${cardBg} text-[8.5px] md:text-[9px]`}
          >
            <div className={`grid grid-cols-4 p-2 font-bold ${isDark ? 'bg-[#111111] text-[#A3A3A3] border-b border-[#262626]' : 'bg-slate-50 text-slate-500 border-b border-inherit'}`}>
              <span>Incumbent</span>
              <span>Price</span>
              <span>Target ICP</span>
              <span>Moat Security</span>
            </div>
            <div className={`divide-y ${isDark ? 'divide-[#2E2E2E]' : 'divide-slate-100'} text-left`}>
              <div className="grid grid-cols-4 p-1.5 text-slate-700 dark:text-[#A3A3A3]">
                <span className={`font-bold ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>Harvey AI</span>
                <span className="text-red-500 font-bold">$12k+</span>
                <span>Enterprise</span>
                <span className="text-orange-500 font-medium">LTD access</span>
              </div>
              <div className="grid grid-cols-4 p-1.5 text-slate-700 dark:text-[#A3A3A3]">
                <span className={`font-bold ${isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}`}>Clio CRM</span>
                <span className="text-red-500 font-bold">$1,200+</span>
                <span>Lawyers</span>
                <span className="text-orange-500 font-medium">Bespoke tool</span>
              </div>
              <div className={`grid grid-cols-4 p-1.5 font-bold ${isDark ? 'bg-[#3B82F6]/5 text-[#3B82F6]' : 'bg-blue-500/5 text-blue-650'}`}>
                <span className={isDark ? 'text-[#FAFAFA]' : 'text-slate-900'}>Our Platform</span>
                <span>$348/yr</span>
                <span>Self-Serve</span>
                <span className="text-emerald-500">100% Moat Match</span>
              </div>
            </div>
          </motion.div>

          {/* SVG 2D Scatterplot Moat Positioning */}
          {substep >= 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`p-2 rounded-xl border ${cardBg} space-y-1.5`}
            >
              <span className={`text-[7.5px] font-bold uppercase tracking-widest ${isDark ? 'text-[#737373]' : 'text-slate-505'} block`}>
                Blue Ocean Position Map
              </span>
              <div className={`relative h-14 w-full border ${isDark ? 'border-[#262626] bg-[#050505]' : 'border-slate-100 bg-white'} flex items-center justify-center overflow-hidden rounded-lg`}>
                <div className="absolute left-[20%] bottom-[20%] w-1.5 h-1.5 rounded-full bg-slate-400 opacity-60" />
                <div className="absolute left-[35%] bottom-[35%] w-1.5 h-1.5 rounded-full bg-slate-400 opacity-60" />
                <span className={`absolute left-[12%] bottom-[4%] text-[5.5px] ${isDark ? 'text-[#737373]' : 'text-slate-400'} scale-[0.9]`}>Legacy Corp</span>
                
                {/* Highlight Sweets Spot */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute right-[20%] top-[20%] w-2.5 h-2.5 rounded-full bg-[#3B82F6] flex items-center justify-center"
                >
                  <div className="w-1 h-1 rounded-full bg-white animate-ping" />
                </motion.div>
                <span className="absolute right-[6%] top-[40%] text-[6.5px] text-[#3B82F6] font-[800]">Our Blue Ocean</span>

                {/* Grid backdrop */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-5 pointer-events-none">
                  <div className="border border-black dark:border-white" />
                  <div className="border border-black dark:border-white" />
                </div>

                <span className={`absolute left-1 top-1 text-[4.5px] ${isDark ? 'text-[#737373]' : 'text-slate-400'} uppercase`}>Self-Serve Autonomy ▲</span>
                <span className={`absolute bottom-1 right-1 text-[4.5px] ${isDark ? 'text-[#737373]' : 'text-slate-400'} uppercase`}>Execution Cost-Ratio ▶</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  // 3. Screen view 2: Revenue Modeling & Growth Charts
  const renderRevenueModeling = (substep = laptopSubstep) => {
    return (
      <div className="w-full h-full p-3.5 md:p-5 flex flex-col justify-between overflow-y-auto select-none">
        <div className={`flex justify-between items-center border-b ${borderCol} pb-2`}>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tight ${textPrimary}`}>
              Venture Economics & Forecasts
            </span>
          </div>
          <span className={`text-[7px] md:text-[7.5px] font-mono ${isDark ? 'bg-[#111111] text-emerald-450 border border-[#262626]' : 'bg-emerald-500/10 text-emerald-600'} px-2.5 py-0.5 rounded font-black`}>
            LTV CERTIFIED
          </span>
        </div>

        <div className="flex-1 my-2 space-y-3 flex flex-col justify-center">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { label: "Gross Margin", val: "94.6%", col: "text-emerald-500" },
              { label: "Lifetime Value LTV", val: "$1,450", col: "text-[#3B82F6]" },
              { label: "Acquisition CAC", val: "$38.20", col: "text-rose-500" },
              { label: "LTV:CAC ratio", val: "38.0x", col: "text-violet-500 font-extrabold" }
            ].map((item, idx) => (
              <div key={idx} className={`p-1.5 rounded-xl border ${cardBg} text-center space-y-0.5`}>
                <span className={`text-[6px] md:text-[6.5px] uppercase ${isDark ? 'text-[#737373]' : 'text-slate-505'} font-bold block truncate`}>
                  {item.label}
                </span>
                <span className={`text-[10px] md:text-[11px] font-bold ${item.col} font-mono block`}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>

          {/* SVG Compounding growth chart */}
          {substep >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl border ${cardBg} space-y-2.5 ${isDark ? 'bg-[#111111]' : 'bg-slate-50/20'}`}
            >
              <div className="flex justify-between items-center text-[7.5px]">
                <span className={`font-bold uppercase ${isDark ? 'text-[#A3A3A3]' : 'text-slate-500'}`}>
                  12-Month Compounding MRR Run-rate
                </span>
                <span className="text-emerald-500 font-black font-mono tracking-wider animate-pulse">
                  +9.5% MoM target
                </span>
              </div>

              <div className="h-16 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 60" fill="none">
                  <line x1="0" y1="15" x2="200" y2="15" stroke={isDark ? "#2E2E2E" : "#F1F5F9"} strokeWidth="0.5" strokeDasharray="3,3" />
                  <line x1="0" y1="40" x2="200" y2="40" stroke={isDark ? "#2E2E2E" : "#F1F5F9"} strokeWidth="0.5" strokeDasharray="3,3" />
                  
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: substep >= 2 ? 1 : 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    d="M0,58 C35,53 70,39 105,25 C140,11 170,4 200,1"
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: substep >= 2 ? 0.12 : 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    d="M0,58 C35,53 70,39 105,25 C140,11 170,4 200,1 L200,60 L0,60 Z"
                    fill="#3B82F6"
                  />
                </svg>
              </div>
              <div className={`flex justify-between text-[6.5px] ${isDark ? 'text-[#737373]' : 'text-slate-450'} font-bold font-mono`}>
                <span>Month 0</span>
                <span>Month 4</span>
                <span>Month 8</span>
                <span>Month 12 ($165K MRR)</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  // 4. Screen view 3: Go-To-Market & ICP Blueprint
  const renderGoToMarket = (substep = laptopSubstep) => {
    return (
      <div className="w-full h-full p-3.5 md:p-5 flex flex-col justify-between overflow-y-auto select-none">
        <div className={`flex justify-between items-center border-b ${borderCol} pb-2`}>
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tight ${textPrimary}`}>
              Go-To-Market Strategic Blueprint
            </span>
          </div>
          <span className={`text-[7px] md:text-[7.5px] font-mono ${isDark ? 'bg-[#111111] text-[#A3A3A3] border border-[#262626]' : 'bg-indigo-500/10 text-indigo-600'} px-2.5 py-0.5 rounded font-black`}>
            DRAFTING...
          </span>
        </div>

        <div className="flex-1 my-2 flex flex-col justify-center space-y-2.5">
          {/* Document container */}
          <div className={`p-3 border ${borderCol} rounded-xl text-[8.5px] leading-relaxed max-h-[140px] overflow-y-auto scrollbar-none ${isDark ? 'bg-[#111111] border-[#262626] text-[#A3A3A3]' : 'bg-slate-50 text-slate-600'} text-left space-y-2`}>
            <div className={`pb-1 border-b border-dashed ${isDark ? 'border-[#2E2E2E]' : 'border-slate-250'} flex justify-between items-center`}>
              <span className={`font-black font-mono text-[7px] md:text-[7.5px] uppercase ${textPrimary}`}>
                Venture_Audit_ICP_Targeting.md
              </span>
              <span className="text-[6.5px] text-emerald-500 font-black animate-pulse font-mono flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> COLLATOR RUNNING
              </span>
            </div>

            <div className="space-y-1">
              <p className={`font-black uppercase text-[7.5px] ${textPrimary}`}>Cohort Segment 1: Pre-seed Accelerators</p>
              <p>Pitching viral risk indices as a complimentary startup-pack catalyst. Embedding checklist validations in CA/NY registers to spark pre-incorporator funnels.</p>
            </div>

            {substep >= 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`space-y-1 border-l-2 border-[#3B82F6] pl-2.5 mt-1.5 ${isDark ? 'text-[#CBD5E1]' : 'text-blue-600'}`}
              >
                <p className="font-black uppercase text-[7.5px]">Direct Partner Funnels</p>
                <p className="italic">"Deploy API endpoints directly within Delaware incorporation workflows, ensuring 100% warm founder acquisition."</p>
              </motion.div>
            )}
          </div>

          {/* Growth roadmap stages */}
          {substep >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-2 text-[7.5px]"
            >
              {[
                { ph: "Launch Alpha", de: "Cohort Beta Integration (15 Programs)", ok: true },
                { ph: "Growth Sync", de: "API Embedding with Registrars", ok: true },
                { ph: "Expansion", de: "Filing Registrator Sync", ok: false }
              ].map((step, idx) => (
                <div key={idx} className={`p-2 rounded-xl border ${cardBg} text-left space-y-0.5 ${step.ok ? (isDark ? 'border-[#3B82F6]/30 bg-[#3B82F6]/5' : 'border-blue-500/30 bg-blue-500/5') : ''}`}>
                  <span className={`font-bold font-mono text-[6.5px] uppercase ${step.ok ? (isDark ? "text-[#3B82F6]" : "text-blue-500") : (isDark ? "text-[#737373]" : "text-slate-400")}`}>
                    {step.ph}
                  </span>
                  <p className={`font-semibold truncate ${isDark ? 'text-[#FAFAFA]' : 'text-slate-800'}`}>
                    {step.de}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  // 5. Screen view 4: Investor Readiness & VC Audit Score
  const renderInvestorReadiness = (substep = laptopSubstep) => {
    return (
      <div className="w-full h-full p-3.5 md:p-5 flex flex-col justify-between overflow-y-auto select-none">
        <div className={`flex justify-between items-center border-b ${borderCol} pb-2`}>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tight ${textPrimary}`}>
              Pre-Seed Venture Capital Audit
            </span>
          </div>
          <span className={`text-[7px] md:text-[7.5px] font-mono ${isDark ? 'bg-[#111111] text-emerald-400 border border-[#262626]' : 'bg-emerald-500/10 text-emerald-600'} px-2.5 py-0.5 rounded font-black`}>
            AUDIT LOCKED
          </span>
        </div>

        <div className="flex-1 my-2 grid grid-cols-5 gap-3.5 items-center">
          {/* Score Circle Panel */}
          <div className={`col-span-2 rounded-xl border ${borderCol} ${cardBg} p-2 flex flex-col items-center justify-center space-y-1.5 h-full min-h-[110px]`}>
            <span className={`text-[6.5px] font-black uppercase ${isDark ? 'text-[#737373]' : 'text-slate-500'} text-center tracking-tight`}>
              VENTURE READINESS RATING
            </span>
            
            {renderCircleGauge(94, substep >= 1)}

            <span className={`text-[7px] ${isDark ? 'text-emerald-450 bg-emerald-500/10 border border-emerald-500/20' : 'text-emerald-600 bg-emerald-500/10'} px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold`}>
              <span className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" /> Delaware OK
            </span>
          </div>

          {/* Guidelines Audit Checklist */}
          <div className={`col-span-3 rounded-xl border ${borderCol} ${cardBg} p-2.5 flex flex-col justify-between h-full min-h-[110px] text-[8px] md:text-[8.5px] text-left`}>
            <span className={`text-[6.5px] font-bold ${isDark ? 'text-[#737373]' : 'text-slate-400'} uppercase tracking-widest block mb-0.5`}>
              COMPLIANCE AUDIT CHECKS
            </span>

            <div className={`space-y-1 font-semibold ${isDark ? 'text-[#CBD5E1]' : 'text-slate-800'}`}>
              {[
                { t: "Underserved TAM/SAM mapping", done: true },
                { t: "Gross Margin SaaS forecasts", done: true },
                { t: "UPL defense exclusionary matrix", done: true },
                { t: "Statutory Delaware certifications", done: false },
              ].map((check, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {check.done ? (
                    <span className="h-3 w-3 rounded-full bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center text-[7px] font-black">✓</span>
                  ) : substep >= 2 ? (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="h-3 w-3 rounded-full bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center text-[7px] font-black"
                    >
                      ✓
                    </motion.span>
                  ) : (
                    <span className={`h-3 w-3 rounded-full border ${isDark ? 'border-[#262626]' : 'border-gray-500/30'} flex items-center justify-center text-[7px] text-slate-450 font-bold`}>-</span>
                  )}
                  <span className={check.done || substep >= 2 ? `line-through ${isDark ? 'text-[#737373]' : 'text-slate-400 opacity-60'}` : `${isDark ? 'text-[#CBD5E1]' : 'text-slate-700'}`}>
                    {check.t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEC Legal Shield approval disclaimers */}
        <div className={`p-1.5 rounded-xl text-[7.5px] ${isDark ? 'bg-[#3B82F6]/5 text-[#A3A3A3]' : 'bg-blue-600/5 text-slate-700'} border ${borderCol} flex items-center justify-between font-mono`}>
          <span className="font-extrabold text-[#3B82F6] uppercase">SAFE-HARBOR SHIELD SEC APPROVED</span>
          <span className={isDark ? 'text-[#737373]' : 'text-slate-400'}>94.6% COMPLETE</span>
        </div>
      </div>
    );
  };

  const renderLaptopChassis = (idx: number, substep = laptopSubstep) => {
    return (
      <div className="w-full max-w-[620px] aspect-[16/10] relative flex flex-col items-center select-none pointer-events-none md:pointer-events-auto">
        
        {/* LAPTOP METAL CABINET FRAME */}
        <div className="w-full h-full bg-neutral-900 border-[7px] md:border-[10px] border-neutral-800 rounded-t-2xl shadow-2xl p-0.5 overflow-hidden relative">
          
          {/* Bezel accent highlights */}
          <div className="absolute inset-0 border border-neutral-950 rounded-[6px] pointer-events-none z-30"></div>
          
          {/* Web Webcam lens */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-950 flex items-center justify-center z-40">
            <div className="w-0.5 h-0.5 rounded-full bg-blue-500"></div>
          </div>

          {/* OPERATING OS GRAPHIC ENGINE */}
          <div className={`w-full h-full rounded-[4px] overflow-hidden flex flex-col relative transition-colors duration-400 ${hostScreenBg}`}>
            
            {/* Simulated Web Browser Tabbar */}
            <div className={`flex h-9 items-center justify-between px-3 border-b ${borderCol} ${browserBarBg}`}>
              <div className="flex items-center space-x-1.5">
                <div className="w-2 rounded-full h-2 bg-[#FF5F56]/80 flex-shrink-0"></div>
                <div className="w-2 rounded-full h-2 bg-[#FFBD2E]/80 flex-shrink-0"></div>
                <div className="w-2 rounded-full h-2 bg-[#27C93F]/80 flex-shrink-0"></div>
              </div>

              <div className={`flex items-center space-x-1.5 border ${borderCol} px-4 py-1 rounded-md text-[9px] font-sans w-2/5 justify-center ${isDark ? 'bg-slate-950/40 text-slate-400' : 'bg-white text-slate-700'}`}>
                <span className="h-1.2 w-1.2 rounded-full bg-blue-500 flex-shrink-0"></span>
                <span className="truncate font-medium">workspace://validation-engine</span>
              </div>

              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <Activity className="h-3 w-3 text-blue-500 animate-pulse" />
                <span className={`text-[8.5px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#334155]'}`}>
                  ACTIVE RUN
                </span>
              </div>
            </div>

            {/* THE LIVE WORKSPACE SCREEN VIEWER */}
            <div className="flex-1 flex overflow-hidden relative text-left">
              {idx === 0 && renderMarketValidation(substep)}
              {idx === 1 && renderCompetitorIntelligence(substep)}
              {idx === 2 && renderRevenueModeling(substep)}
              {idx === 3 && renderGoToMarket(substep)}
              {idx === 4 && renderInvestorReadiness(substep)}
            </div>

            {/* Simulated Desktop Status Tray */}
            <div className={`h-7.5 border-t ${borderCol} ${browserBarBg} flex items-center justify-between px-3 text-[8px] md:text-[8.5px] font-mono text-zinc-550 tracking-tight z-30`}>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0"></span>
                <span className={`font-bold ${isDark ? 'text-slate-400' : 'text-[#334155]'}`}>
                  SECTION: {idx + 1} / 5
                </span>
              </div>
              
            </div>

          </div>

        </div>

        {/* Laptop metal bottom stand bezel chassis */}
        <div className="relative mx-auto w-full h-3 md:h-3.5 bg-[#1F2937] md:bg-neutral-800 border-t border-neutral-700 shadow-2xl rounded-b-xl z-20 flex items-center justify-center">
          <div className="w-16 md:w-20 h-1 bg-neutral-900 rounded-b"></div>
        </div>

      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full py-12 md:py-20" id="features_story_root">
      
      {/* 
        DESKTOP / TABLET ONLY PIN LAYOUT PLATFORM (widths >= 768px)
        Left side: vertical scrolling chapters (occupy approximately 1 viewport h each).
        Right side: ONE sticky persistent laptop container that locks into screen while scrolling.
      */}
      <div className="hidden md:flex relative w-full flex-row items-start min-h-[350vh] gap-8 md:gap-10 lg:gap-14">
        
        {/* LEFT COLUMN: SCROLL SEGMENTS (NARRATIVE WORKFLOW STREAM) */}
        <div className="w-full md:w-[44%] flex flex-col pt-4 md:pt-[10vh] pb-[20vh] z-10 px-4 md:px-0 order-2 md:order-1">
          
          <div className="space-y-8 md:space-y-0">
            {features.map((item, index) => {
              const isSelected = activeIndex === index;
              return (
                <div
                  key={item.id}
                  id={`feature-section-${index}`}
                  className="min-h-[50vh] md:min-h-[63vh] flex flex-col justify-center text-left py-6 md:py-8"
                >
                  <motion.div
                    animate={{ 
                      opacity: isSelected ? 1 : 0.25,
                      x: isSelected ? 0 : -8
                    }}
                    transition={{ duration: 0.4 }}
                    className="space-y-5 pl-6 border-l-2 outline-none select-text"
                    style={{
                      borderLeftColor: isSelected ? '#3B82F6' : 'transparent'
                    }}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold tracking-widest text-[#3B82F6] font-mono block">
                        {item.tagline}
                      </span>
                      <h3 className={`text-2xl md:text-3xl font-[800] tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                        {item.label}
                      </h3>
                    </div>

                    <h4 className={`text-[15px] md:text-[17px] font-bold leading-snug ${isDark ? 'text-zinc-200' : 'text-[#1F2937]'}`}>
                      {item.title}
                    </h4>

                    <p className={`text-xs md:text-sm leading-relaxed ${textMuted} font-medium max-w-md`}>
                      {item.description}
                    </p>

                    <ul className="space-y-3 pt-2">
                       {item.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start text-xs font-semibold gap-3">
                          <span className="h-4.5 w-4.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-extrabold flex-shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className={isDark ? 'text-zinc-200' : 'text-[#1F2937]'}>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Request sandbox button */}
                    <div className="pt-2">
                      <button 
                        onClick={() => router.push("/chatbot")}
                        className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all cursor-pointer"
                      >
                        <span>Request Sandbox Access</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: STICKY STATIONARY LAPTOP VIEWPORT (ONE LAPTOP ONLY) */}
        <div className="w-full md:w-[56%] sticky top-[125px] h-[75vh] flex items-center justify-center z-20 order-1 md:order-2">
          {renderLaptopChassis(activeIndex)}
        </div>

      </div>

      {/* 
        MOBILE ONLY LAYOUT (< 768px)
        Disable all sticky and pinning behavior.
        Stack content vertically:
        Feature mockup
        ↓
        Feature text
        ↓
        Next feature mockup
        ↓
        Next feature text
        Each feature appears naturally while scrolling.
      */}
      <div className="flex md:hidden flex-col w-full px-4 gap-16 pt-4">
        {features.map((item, index) => {
          return (
            <div key={item.id} className="flex flex-col gap-6">
              
              {/* Feature mockup */}
              <div className="w-full flex justify-center py-2">
                {renderLaptopChassis(index, 2)}
              </div>

              {/* Feature text */}
              <div className="space-y-4 pl-4 border-l-2 border-l-[#3B82F6] text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold tracking-widest text-[#3B82F6] font-mono block">
                    {item.tagline}
                  </span>
                  <h3 className={`text-xl font-[800] tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                    {item.label}
                  </h3>
                </div>

                <h4 className={`text-sm font-bold leading-snug ${isDark ? 'text-zinc-200' : 'text-[#1F2937]'}`}>
                  {item.title}
                </h4>

                <p className={`text-xs leading-relaxed ${textMuted} font-medium`}>
                  {item.description}
                </p>

                <ul className="space-y-2.5 pt-1">
                  {item.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start text-xs font-semibold gap-2.5">
                      <span className="h-4.5 w-4.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-extrabold flex-shrink-0 mt-0.5">
                        ✓
                      </span>
                      <span className={isDark ? 'text-zinc-200' : 'text-[#1F2937]'}>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Request sandbox button */}
                <div className="pt-1.5">
                  <button 
                    onClick={() => router.push("/chatbot")}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all cursor-pointer"
                  >
                    <span>Request Sandbox Access</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
