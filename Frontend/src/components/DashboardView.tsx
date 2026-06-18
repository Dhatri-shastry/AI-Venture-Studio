/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  Blocks,
  Search,
  FileText,
  Target,
  BarChart3,
  Settings,
  HelpCircle,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  UserCheck2,
} from 'lucide-react';

export default function DashboardView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVenture, setSelectedVenture] = useState('MedTech AI Diagnostics');
  
  // Custom interactive mock state - task checkoff
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Finalize TAM calculations for seed analysis', category: 'Research', completed: false },
    { id: 2, text: 'Structure patent footprint in innovation matrix', category: 'Innovation', completed: true },
    { id: 3, text: 'Assemble pitch brief for first partner pipeline', category: 'Proposal', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Healthcare Dashboard Reference colors:
  // Light off-white base client workspace, floating modern white widgets, pure blue accent marks.
  return (
    <div className="min-h-screen bg-[#F5F8FC] dark:bg-[#0A0D14] flex transition-colors text-slate-800 dark:text-slate-200">
      
      {/* 1. HEALTHCARE-STYLE VERTICAL SIDEBAR */}
      <aside className="w-64 border-r border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#11131E] flex flex-col justify-between shrink-0">
        <div className="p-6">
          {/* Dashboard Title Branding */}
          <div className="flex items-center space-x-2.5 mb-8 cursor-pointer" onClick={() => router.push("/")}>
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/10">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 12h10L10 22l10-10H10L12 2z" />
              </svg>
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-gray-900 dark:text-white">
              Venture <span className="text-blue-500">Core</span>
            </span>
          </div>

          {/* Sidebar Menu matching DocApp Reference */}
          <div className="space-y-6">
            <div>
              <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono mb-2">
                Navigation
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Compass className="h-4 w-4" />
                    <span>Diagnostics</span>
                  </div>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                </button>

                <button
                  onClick={() => router.push("/chatbot")}
                  className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/40 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span>AI Co-Pilot</span>
                </button>

                <button
                  onClick={() => setActiveTab('workspace')}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'workspace'
                      ? 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <Blocks className="h-4 w-4" />
                  <span>Sandbox Workspace</span>
                </button>

                <button
                  onClick={() => setActiveTab('research')}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'research'
                      ? 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <Search className="h-4 w-4" />
                  <span>Intelligence Index</span>
                </button>

                <button
                  onClick={() => setActiveTab('docs')}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'docs'
                      ? 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Documentation Hub</span>
                </button>

                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'proposals'
                      ? 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <Target className="h-4 w-4" />
                  <span>Proposal Architect</span>
                </button>
              </div>
            </div>

            <div>
              <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono mb-2">
                Operational
              </p>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'reports'
                      ? 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dynamic Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/10'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/40'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings Control</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Card matching Healthcare Reference layout bottom */}
        <div className="p-6 border-t border-[#E5E7EB] dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-bold text-blue-600">
                DS
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#11131E]"></span>
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">Dhatri S.</h4>
              <p className="text-[10px] text-gray-400 truncate">Venture Constructor</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN HUB WORKSPACE CANVAS */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10 max-w-7xl">
        
        {/* HEADER TOOL ACTIONS */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-blue-600 font-mono mb-1">
              <span>SANDBOX ENVIRONMENT</span>
              <span className="text-gray-300 dark:text-gray-700">/</span>
              <span>LIVE REPLACEMENT RUNTIME</span>
            </div>
            
            {/* Active Venture Dropdown representation */}
            <div className="flex items-center space-x-2">
              <h2 className="font-display text-2xl font-black text-gray-900 dark:text-white">
                {selectedVenture}
              </h2>
              <select
                value={selectedVenture}
                onChange={(e) => setSelectedVenture(e.target.value)}
                className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white bg-transparent border-0 outline-none cursor-pointer"
              >
                <option value="MedTech AI Diagnostics">MedTech AI Diagnostics</option>
                <option value="SaaS Carbon Flow">SaaS Carbon Flow</option>
                <option value="CleanEnergy Logistics">CleanEnergy Logistics</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick action info badge */}
            <div className="hidden md:flex items-center space-x-1.5 text-[10.5px] px-3 py-1.5 rounded-lg border border-dashed border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/20">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span>Workspace Sync: Active</span>
            </div>

            <button
              onClick={() => router.push("/chatbot")}
              className="flex items-center space-x-2 rounded-full bg-[#3B82F6] hover:bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 cursor-pointer transition-all duration-200"
            >
              <Sparkles className="h-4 w-4" />
              <span>Invoke AI Agent</span>
            </button>
          </div>
        </header>

        {/* RENDER DYNAMIC CORE TAB SUB-CANVASES */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* ROW 1: 3-BENTO MODULES (Healthcare style widgets layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Widget A: Venture Readiness Gauge (Left Col - spans 4 cols) */}
              <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#12141F] border border-[#E5E7EB] dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono block mb-1">
                    DIAGNOSTIC STATUS
                  </span>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2">Startup Readiness</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed sm:max-w-xs">
                    Comprehensive compliance and market integrity rating. Check points pass seed criteria.
                  </p>
                </div>

                {/* Circular Gauge Placeholder */}
                <div className="py-6 flex flex-col items-center justify-center relative">
                  {/* Circular visual stroke */}
                  <div className="relative h-32 w-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-gray-100 dark:text-gray-800"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="#3B82F6"
                        strokeWidth="10"
                        strokeDasharray="339"
                        strokeDashoffset="84" // 255 filled = 75%
                        fill="transparent"
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black text-gray-900 dark:text-white font-display">75%</span>
                      <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded-full">
                        HIGH
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E7EB] dark:border-gray-800 flex justify-between items-center text-xs">
                  <span className="text-gray-500">8 of 12 Vectors Cleared</span>
                  <button className="text-blue-500 font-bold hover:underline" onClick={() => router.push("/chatbot")}>
                    Audit List
                  </button>
                </div>
              </div>

              {/* Widget B: Market Intelligence progress gauge (Spans 8 cols) */}
              <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#12141F] border border-[#E5E7EB] dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono block mb-1">
                        INTELLIGENCE FLOW
                      </span>
                      <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Market Micro-Trend Analysis</h3>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      Live Assessment Stream
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-1">
                    Computational analysis indexing addressable market indicators against target sector datasets.
                  </p>
                </div>

                {/* Handcrafted Highly Polished Visual Graph (Healthcare style sleek line plot mockup) */}
                <div className="h-44 relative my-4 flex items-end">
                  {/* Grid Lines background */}
                  <div className="absolute inset-x-0 h-px bg-gray-100 dark:bg-gray-800 bottom-0"></div>
                  <div className="absolute inset-x-0 h-px bg-gray-100 dark:bg-gray-800 bottom-1/3"></div>
                  <div className="absolute inset-x-0 h-px bg-gray-100 dark:bg-gray-800 bottom-2/3"></div>
                  <div className="absolute inset-x-0 h-px bg-gray-100 dark:bg-gray-800 top-0"></div>

                  {/* Gradient Area representation */}
                  <svg className="absolute inset-x-0 bottom-0 w-full h-[85%] pointer-events-none" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 25 C10 18, 20 8, 30 11 C40 14, 50 3, 60 5 C70 7, 80 18, 90 2 C100 12, 100 12, 100 30 L0 30 Z" fill="url(#chart-area-grad)" />
                    <path d="M0 25 C10 18, 20 8, 30 11 C40 14, 50 3, 60 5 C70 7, 80 18, 90 2 C100 12, 100 12, 100 12" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                  </svg>

                  {/* Nodes with responsive tooltips */}
                  <div className="absolute left-[30.5%] bottom-[64%] h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-500/25 cursor-help group">
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                      TAM: $1.2B
                    </div>
                  </div>

                  <div className="absolute left-[50.5%] bottom-[90%] h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-500/25 cursor-help group">
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                      CAGR: 18.4%
                    </div>
                  </div>

                  <div className="absolute left-[90.5%] bottom-[93%] h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-500/25 cursor-help group">
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-slate-900 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                      SAM Focus: High
                    </div>
                  </div>

                  {/* Bottom timeline metrics */}
                  <div className="w-full justify-between flex text-[10px] text-gray-400 dark:text-gray-500 font-mono z-10 px-1 pt-2">
                    <span>JAN 26</span>
                    <span>FEB 26</span>
                    <span>MAR 26</span>
                    <span>APR 26</span>
                    <span>MAY 26</span>
                    <span>JUN 26</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between pr-2">
                  <div className="flex space-x-4 text-[11px] text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span>Target TAM Projection</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                      <span>Competitor Cohort Median</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-500 font-bold">Stable</span>
                </div>
              </div>

            </div>

            {/* ROW 2: PROGRESSION MATRIX SUMMARY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Dynamic Workspace Indicators (Spans 8 cols) */}
              <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#12141F] border border-[#E5E7EB] dark:border-gray-800 p-6 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono block mb-1">
                    PROGRESS INDEX
                  </span>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Architectural Progression Stats</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Calculated readiness scores index for each component in active venture sandbox workspace.
                  </p>
                </div>

                {/* Progress Indicators list inspired by monthly reports under reference */}
                <div className="space-y-4">
                  {[
                    { label: 'Market Research Assessment', score: 85, color: 'bg-blue-600', text: 'Diagnostic search index updated and compiled.' },
                    { label: 'Competitor Matrix Map', score: 70, color: 'bg-indigo-500', text: 'Competitor Discovery grid mapping complete.' },
                    { label: 'Platform Documentation Build', score: 45, color: 'bg-purple-500', text: 'Executive brief assembled; slides in draft.' },
                    { label: 'Proposal Pitch Drafting', score: 30, color: 'bg-pink-500', text: 'Agreement flow setup started.' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5 p-3.5 rounded-xl border border-gray-100 hover:border-blue-100 dark:border-gray-800/80 dark:hover:border-blue-950 bg-white dark:bg-[#151824] transition-all">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{item.label}</span>
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{item.score}%</span>
                      </div>
                      
                      {/* Grid background progress container */}
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${item.score}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-sans">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: Tasks & Activity Tracker (Spans 4 cols) */}
              <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-[#12141F] border border-[#E5E7EB] dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono block mb-1">
                      QUEUE CONTROL
                    </span>
                    <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Workspace Taskbook</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Toggle sandbox development roadmap items.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all select-none flex items-start space-x-2.5 ${
                          task.completed
                            ? 'bg-emerald-50/20 text-gray-400 dark:text-gray-500 border-emerald-100 dark:border-emerald-900/20 line-through'
                            : 'bg-white dark:bg-black/20 text-gray-700 dark:text-gray-300 border-gray-150 dark:border-gray-800 hover:border-blue-200'
                        }`}
                      >
                        <div className="mt-0.5">
                          {task.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors shrink-0"></div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11.5px] leading-tight font-medium">{task.text}</p>
                          <span className="inline-block text-[9px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-400 px-1 rounded">
                            {task.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800/85">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 dark:text-gray-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span>Diagnostic validation check triggers upon list clearance</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 3: COMPETITOR ANALYTICS COMPARATIVE BREAKDOWN */}
            <div className="rounded-2xl bg-white dark:bg-[#12141F] border border-[#E5E7EB] dark:border-gray-800 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono block mb-1">
                    MATRIX CORRELATION
                  </span>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    Competitor Discovery Analysis Group
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Structured positioning comparative vectors generated directly using local sandbox settings.
                  </p>
                </div>
                
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-full px-2.5 py-1 font-mono font-bold">
                  MODERN SEED TIER SYSTEM
                </span>
              </div>

              {/* Responsive comparison grids */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-gray-800 pb-2 text-gray-400 dark:text-gray-500 font-mono text-[10px]">
                      <th className="pb-3.5 font-semibold">ECOSYSTEM PILOT PLAYER</th>
                      <th className="pb-3.5 font-semibold">COMPETITIVE ANGLE</th>
                      <th className="pb-3.5 font-semibold text-center">TRACTION SPEED</th>
                      <th className="pb-3.5 font-semibold text-center">VULNERABILITY INDEX</th>
                      <th className="pb-3.5 font-semibold text-right">OUR GAP EDGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Incumbent Alpha Diagnostics', angle: 'High cost physical hardware & enterprise contracts', speed: 'Steady', vulnerability: 'Low agility to micro-service APIs', gap: 'Instant Edge integration API' },
                      { name: 'MedScapes AI Platform', angle: 'SaaS only dashboard lacking predictive audit trails', speed: 'Rapid', vulnerability: 'Generic model with low diagnostic depth', gap: 'Fine-tuned proprietary parameters' },
                      { name: 'Helix Diagnostics Hub', angle: 'Direct-to-consumer healthcare wellness charts', speed: 'Moderate', vulnerability: 'Strict regulatory overhead burdens', gap: 'B2B white-label focus structure' },
                    ].map((comp, idx) => (
                      <tr key={idx} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-[#151825]/30 transition-colors">
                        <td className="py-4 font-bold text-gray-900 dark:text-white">{comp.name}</td>
                        <td className="py-4 text-gray-500 dark:text-gray-400">{comp.angle}</td>
                        <td className="py-4 text-center">
                          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/20 text-blue-600 text-[10px]">
                            {comp.speed}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/20 text-red-600 text-[10px]">
                            {comp.vulnerability}
                          </span>
                        </td>
                        <td className="py-4 text-right font-semibold text-emerald-500">{comp.gap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white dark:bg-[#12141F] border border-gray-150 dark:border-gray-850 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-full">
              <Blocks className="h-8 w-8 animate-pulse" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                {activeTab.toUpperCase()} Module Placeholder Workspace
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                This component triggers active API integration capabilities. It functions beautifully as part of the Phase 1 visual only dashboard system.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-xs font-semibold px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-all dark:text-gray-300 dark:hover:bg-gray-900 cursor-pointer"
            >
              Return to Core Diagnostics
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
