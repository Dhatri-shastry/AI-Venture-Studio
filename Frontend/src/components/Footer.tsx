/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Twitter, Linkedin, Github } from 'lucide-react';
import { type FormEvent } from "react";

interface FooterProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export default function Footer({ theme, setTheme }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full border-t border-[#E5E7EB] dark:border-[#1E1E1E] bg-white dark:bg-[#050505] transition-all duration-300 z-10"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Main Grid containing logo, columns, signup */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 pb-12">
          
          {/* Column 1: App Info (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center space-x-2.5">
              <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 12h10L10 22l10-10H10L12 2z" />
                </svg>
              </div>
              <span className="font-sans font-extrabold text-[#111827] dark:text-white tracking-tight text-base">
                AI Venture Studio
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#A1A1AA] leading-[1.6] max-w-[280px]">
              AI-powered venture creation workspace for startup founders, innovators and builders.
            </p>

            {/* Social Icons + Optional Integrated Soft Theme Switcher Inline */}
            <div className="flex items-center space-x-4 pt-1">
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer"
                data-cursor="X"
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                data-cursor="LinkedIn"
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                data-cursor="GitHub"
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              
              <div className="w-[1px] h-4 bg-[#E5E7EB] dark:bg-[#1E1E1E]"></div>

              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                data-cursor="Toggle"
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-md p-1 hover:bg-[#F1F5F9] dark:hover:bg-[#111111]"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Columns 2, 3, 4: Structured Resource Sections (Span 5) */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:col-span-5">
            {/* Product Column */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#111827] dark:text-white">
                Product
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#features" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Workspace
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Research
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Ready Index
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#111827] dark:text-white">
                Resources
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#111827] dark:text-white">
                Company
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="#" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 5: Beautiful Integrated Newsletter UI (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#111827] dark:text-white">
              STAY DETAILED
            </h4>
            <p className="text-xs text-[#475569] dark:text-[#A1A1AA] leading-relaxed">
              Subscribe to recieve venture workspace updates weekly.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1E1E1E] bg-[#F8FAFC] dark:bg-[#0A0A0A] text-[#111827] dark:text-white text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-slate-400"
                />
              </div>
              <button
                type="submit"
                data-cursor="Subscribe"
                className="w-full px-4 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98]"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

        </div>

        {/* Divider line & Bottom Row */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1E1E1E] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-[#475569] dark:text-[#A1A1AA]">
          <div>
            © 2026 AI Venture Studio. All rights reserved.
          </div>
          <div className="font-mono text-[10px] tracking-tight text-slate-400 dark:text-[#A1A1AA]/60">
            Built for innovators, founders and future builders.
          </div>
        </div>

      </div>
    </motion.footer>
  );
}
