/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useState, useEffect, useRef } from "react";
import type { ComponentType, ReactNode } from "react";
import { Lightbulb, Search, Compass, Rocket, CheckCircle2, ArrowRight, BarChart3, ShieldCheck, Layers } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


interface StepItem {
  id: string;
  stepNum: string;
  title: string;
  description: string;
  additionalText: string;
  icon: ComponentType<{ className?: string }>;
  rightPanel: ReactNode;
}

interface HowItWorksProps {
  theme?: 'light' | 'dark';
}

export default function HowItWorks({ theme = 'light' }: HowItWorksProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  
  const [activeStep, setActiveStep] = useState(0);

  const isDark = theme === 'dark';

  // High-fidelity corporate right panels with zero ambient glow, extreme legibility, and strict design colors
  const steps: StepItem[] = [
    {
      id: "01",
      stepNum: "1",
      title: "Define Your Venture",
      description: "Describe the problem, target customer or user profile, industry focus, and core business model.",
      additionalText: "The platform organizes your workspace and identifies the research required to validate the opportunity.",
      icon: Lightbulb,
      rightPanel: (
        <div className={`p-6 rounded-[24px] border h-full flex flex-col justify-between ${
          isDark 
            ? 'bg-[#171717] border-[#262626]' 
            : 'bg-[#F8FAFC] border-[#E2E8F0]'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#3B82F6]' : 'bg-[#2563EB]'}`}></span>
              <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'
              }`}>
                WORKSPACE INCEPTION
              </span>
            </div>
            <div className="space-y-2">
              <div className={`text-[11px] font-mono p-2.5 rounded border ${
                isDark 
                  ? 'bg-[#111111] border-[#262626] text-[#D4D4D8]' 
                  : 'bg-white border-[#E2E8F0] text-[#334155]'
              }`}>
                <span className={`font-bold ${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'}`}>PROBLEM:</span> Multi-tenant allocation lag in enterprise AI systems
              </div>
              <div className={`text-[11px] font-mono p-2.5 rounded border ${
                isDark 
                  ? 'bg-[#111111] border-[#262626] text-[#D4D4D8]' 
                  : 'bg-white border-[#E2E8F0] text-[#334155]'
              }`}>
                <span className={`font-bold ${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'}`}>TARGET:</span> Tech Lead & Principal Platform Architects
              </div>
            </div>
          </div>
          <div className={`flex items-center justify-between border-t pt-3 mt-2 ${
            isDark ? 'border-[#262626]' : 'border-[#E2E8F0]'
          }`}>
            <span className={`text-[11px] font-medium ${isDark ? 'text-[#A1A1AA]' : 'text-[#64748B]'}`}>
              Workspace Configured
            </span>
            <CheckCircle2 className={`h-4 w-4 ${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'}`} />
          </div>
        </div>
      )
    },
    {
      id: "02",
      stepNum: "2",
      title: "Research Markets & Competitors",
      description: "The platform gathers industry reports, market sizing data, competitor intelligence, customer demand signals, and regulatory information.",
      additionalText: "Everything is consolidated into a single research workspace.",
      icon: Search,
      rightPanel: (
        <div className={`p-6 rounded-[24px] border h-full flex flex-col justify-between ${
          isDark 
            ? 'bg-[#171717] border-[#262626]' 
            : 'bg-[#F8FAFC] border-[#E2E8F0]'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                EVIDENCE GATHERING
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className={isDark ? 'text-[#D4D4D8]' : 'text-[#334155]'}>TAM (Market Sizing)</span>
                <span className={`font-mono font-bold ${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'}`}>$14.8 Billion</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#111111]' : 'bg-[#E2E8F0]'}`}>
                <div className="h-full bg-emerald-500 w-[78%]" />
              </div>

              <div className="flex justify-between items-center text-[11px] mt-1">
                <span className={isDark ? 'text-[#D4D4D8]' : 'text-[#334155]'}>CAGR Benchmark</span>
                <span className={`font-mono font-bold ${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'}`}>18.4%</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#111111]' : 'bg-[#E2E8F0]'}`}>
                <div className="h-full bg-emerald-500 w-[60%]" />
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-2 p-2 rounded text-[11px] font-mono border ${
            isDark 
              ? 'bg-[#111111] border-[#262626] text-[#A1A1AA]' 
              : 'bg-white border-[#E2E8F0] text-[#64748B]'
          }`}>
            <BarChart3 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
            <span>Structured indicators consolidated</span>
          </div>
        </div>
      )
    },
    {
      id: "03",
      stepNum: "3",
      title: "Generate Strategic Deliverables",
      description: "Create market analysis, revenue models, go-to-market plans, competitive positioning, and investment readiness reports.",
      additionalText: "Each recommendation is linked to supporting evidence.",
      icon: Compass,
      rightPanel: (
        <div className={`p-6 rounded-[24px] border h-full flex flex-col justify-between ${
          isDark 
            ? 'bg-[#171717] border-[#262626]' 
            : 'bg-[#F8FAFC] border-[#E2E8F0]'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-violet-500"></span>
              <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                isDark ? 'text-violet-400' : 'text-violet-700'
              }`}>
                STRATEGY AUTOMATION
              </span>
            </div>
            <div className="space-y-1">
              <div className={`flex items-center justify-between text-[11px] p-1.5 border-b ${
                isDark ? 'border-[#262626] text-[#D4D4D8]' : 'border-[#E2E8F0] text-[#334155]'
              }`}>
                <span>Revenue Projections</span>
                <span className="text-violet-500 font-mono font-bold text-[10px]">READY</span>
              </div>
              <div className={`flex items-center justify-between text-[11px] p-1.5 border-b ${
                isDark ? 'border-[#262626] text-[#D4D4D8]' : 'border-[#E2E8F0] text-[#334155]'
              }`}>
                <span>Go-To-Market Plans</span>
                <span className="text-violet-500 font-mono font-bold text-[10px]">READY</span>
              </div>
              <div className={`flex items-center justify-between text-[11px] p-1.5 ${
                isDark ? 'text-[#D4D4D8]' : 'text-[#334155]'
              }`}>
                <span>Investment Deck</span>
                <span className="text-violet-500 font-mono font-bold text-[10px]">READY</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 justify-end text-[10px] font-mono font-semibold text-violet-500">
            <span>Evidence lineage verified</span>
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
      )
    },
    {
      id: "04",
      stepNum: "4",
      title: "Execute & Iterate",
      description: "Convert research into investor briefs, partnership strategies, product requirements, validation reports, and execution roadmaps.",
      additionalText: "Continue refining the venture as new information becomes available.",
      icon: Rocket,
      rightPanel: (
        <div className={`p-6 rounded-[24px] border h-full flex flex-col justify-between ${
          isDark 
            ? 'bg-[#171717] border-[#262626]' 
            : 'bg-[#F8FAFC] border-[#E2E8F0]'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                isDark ? 'text-orange-400' : 'text-orange-700'
              }`}>
                OPERATIONAL MILESTONES
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-[#D4D4D8]' : 'text-[#334155]'}`}>
                <ArrowRight className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                <span>Sprint 1: Deploy Core API</span>
              </div>
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-[#D4D4D8]' : 'text-[#334155]'}`}>
                <ArrowRight className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                <span>Sprint 2: Alpha User Intake</span>
              </div>
              <div className={`flex items-center gap-1.5 ${isDark ? 'text-[#D4D4D8]' : 'text-[#334155]'}`}>
                <ArrowRight className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                <span>Sprint 3: Deliver Deck</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] mt-2 font-mono flex items-center justify-between text-[#3B82F6] dark:text-[#2563EB] font-bold">
            <span>Validation loop active</span>
            <Layers className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {

     gsap.registerPlugin(ScrollTrigger);

    if (!triggerRef.current || !scrollTrackRef.current) return;

    // Premium horizontal storytelling GSAP track pin
    const pin = gsap.to(scrollTrackRef.current, {
      x: () => -(scrollTrackRef.current!.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        pin: true,
        scrub: 0.8,
        start: "top top",
        end: () => `+=${scrollTrackRef.current!.scrollWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          let index = 0;
          if (progress < 0.16) {
            index = 0;
          } else if (progress < 0.50) {
            index = 1;
          } else if (progress < 0.83) {
            index = 2;
          } else {
            index = 3;
          }
          setActiveStep(index);
        }
      }
    });

    return () => {
      if (pin.scrollTrigger) pin.scrollTrigger.kill();
      pin.kill();
    };
  }, []);

  return (
    <div
  ref={triggerRef}
  id="how-it-works"
  className={`relative w-full h-auto overflow-hidden flex flex-col gap-10 md:gap-14 py-16 md:py-20 select-none z-30 transition-colors duration-500 ${
    isDark ? "bg-[#000000]" : "bg-[#F8FAFC]"
  }`}
>
      
      {/* Pristine background with zero engineering grids or wireframes */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#000000] to-[#050505]" />
      )}

      {/* Section Header */}
      <div className="w-full text-center px-6 relative z-10 flex-shrink-0 max-w-[800px] mx-auto">
        <h2 
          className="font-sans font-semibold tracking-tight mb-4"
          style={{ 
            fontSize: "40px", 
            lineHeight: "1.2", 
            fontWeight: 600,
            color: isDark ? "#FFFFFF" : "#0F172A" 
          }}
        >
          How to Use Venture Studio
        </h2>
        <p 
          className="font-normal max-w-[640px] mx-auto"
          style={{ 
            fontSize: "18px", 
            lineHeight: "1.8", 
            color: isDark ? "#D4D4D8" : "#334155" 
          }}
        >
          Move from idea validation to execution using a structured venture-building workflow.
        </p>
      </div>

      {/* Premium Horizontal Track without secondary navigation lines, steps, indicators or links below */}
      <div className="w-full flex items-center relative overflow-hidden z-20 my-2">
        <div 
          ref={scrollTrackRef} 
          className="flex flex-row flex-nowrap items-center"
          style={{ 
            paddingLeft: "calc(50vw - min(430px, 45vw))", 
            paddingRight: "calc(50vw - min(430px, 45vw))" 
          }}
        >
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            
            return (
              <div 
                key={step.id}
                className="w-[100vw] md:w-[860px] flex-shrink-0 flex items-center justify-center px-4 md:px-6 relative"
                style={{
                  transform: isSelected ? 'scale(1)' : isDark ? 'scale(0.95)' : 'scale(0.96)',
                  opacity: isSelected ? 1 : isDark ? 0.5 : 0.85,
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease'
                }}
              >
                
                {/* 
                  Card markup styling complying with rigid requirements:
                  - Dark Active and Inactive Card Body and Typography is thoroughly optimized: No text is under-contrasted.
                  - Light Card Body uses clean white #FFFFFF cards, borders #E2E8F0, dark text #0F172A and #475569.
                  - Border Radius of 24px is applied to Card container.
                  - Dark shadow: 0 20px 60px rgba(0,0,0,0.35) or light mode shadow is configured cleanly.
                */}
                <div 
                  className={`text-left w-full max-w-[800px] md:max-w-none rounded-[24px] border p-8 md:p-10 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-[#111111] border-[#262626]'
                      : 'bg-[#FFFFFF] border-[#E2E8F0]'
                  }`}
                  style={{
                    boxShadow: isDark 
                      ? '0 20px 60px rgba(0,0,0,0.35)' 
                      : isSelected 
                        ? '0 20px 45px -15px rgba(15,23,42,0.06)' 
                        : 'none'
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-stretch">
                    
                    {/* Left Side Content Column (60% density ratio) */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                      <div>
                        {/* Step Code Flag */}
                        <div className="flex items-center gap-2.5 mb-4">
                          <span className={`text-xs font-mono font-extrabold uppercase tracking-widest px-2.5 py-1 rounded ${
                            isDark
                              ? isSelected
                                ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/25'
                                : 'bg-[#171717] text-[#A1A1AA] border border-[#262626]'
                              : 'bg-[#2563EB]/5 text-[#2563EB]'
                          }`}>
                            STEP 0{step.stepNum}
                          </span>
                        </div>

                        {/* Title (e.g. "1. Define Your Venture") */}
                        <h3 
                          className="font-sans font-semibold tracking-tight mb-4" 
                          style={{ 
                            fontSize: "24px",
                            color: isDark ? '#FFFFFF' : '#0F172A'
                          }}
                        >
                          {step.stepNum}. {step.title}
                        </h3>

                        {/* Solid clear description paragraphs - strictly avoiding light/dark dilution or nested low-opacity rules */}
                        <div className="space-y-4">
                          <p 
                            className="font-medium"
                            style={{ 
                              fontSize: "15px", 
                              lineHeight: "1.7",
                              color: isDark ? '#D4D4D8' : '#334155'
                            }}
                          >
                            {step.description}
                          </p>
                          <p 
                            className={`border-l-2 p-1.5 pl-3 ${
                              isDark ? 'border-[#262626]' : 'border-[#E2E8F0]'
                            }`}
                            style={{ 
                              fontSize: "13.5px", 
                              lineHeight: "1.6",
                              color: isDark ? '#A1A1AA' : '#64748B'
                            }}
                          >
                            {step.additionalText}
                          </p>
                        </div>
                      </div>

                      {/* Card Bottom Progress Line */}
                      <div className={`w-full h-[2px] rounded-full overflow-hidden mt-6 ${
                        isDark ? 'bg-[#262626]' : 'bg-[#E2E8F0]'
                      }`}>
                        <div 
                          className={`h-full transition-all duration-300 ${isDark ? 'bg-[#3B82F6]' : 'bg-[#2563EB]'}`}
                          style={{ width: isSelected ? "100%" : "0%" }}
                        />
                      </div>
                    </div>

                    {/* Right Side Corporate Mock-UI Visual Panel Column (40% showcase) */}
                    <div className="md:col-span-5 h-[200px] md:h-auto min-h-[180px]">
                      {step.rightPanel}
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
