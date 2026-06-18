/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";
import { useState, useEffect, type FormEvent } from "react";
import { 
  Lock, 
  User, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Chrome,
  Github,
  Mail,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface LoginCardProps {
  initialMode?: 'login' | 'signup' | 'forgot';
  onSuccess: () => void;
  onExit: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onSwitchMode?: (mode: 'login' | 'signup') => void;
}

export default function LoginCard({
  initialMode = 'login',
  onSuccess,
  onExit,
  theme,
  toggleTheme,
  onSwitchMode
}: LoginCardProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Feedback States
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);

  // Sync mode changes with initialMode prop
  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [initialMode]);

  // Handle local mode toggles and call parent to sync URL/state
  const handleSetMode = (targetMode: 'login' | 'signup' | 'forgot') => {
    setMode(targetMode);
    setErrorMsg(null);
    setSuccessMsg(null);
    if (onSwitchMode && (targetMode === 'login' || targetMode === 'signup')) {
      onSwitchMode(targetMode);
    }
  };

  // Simulated Social Login Connections
  const handleSocialLogin = (provider: 'Google' | 'GitHub' | 'X') => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoadingMsg(`Connecting to ${provider} OAuth...`);

    setTimeout(() => {
      setLoadingMsg(`Authorizing secure credentials with ${provider}...`);
      setTimeout(() => {
        setLoadingMsg(null);
        
        const nameMap = {
          'Google': 'Google Founder',
          'GitHub': 'GitHub Dev',
          'X': 'X Innovator'
        };
        const emailMap = {
          'Google': 'google.founder@gmail.com',
          'GitHub': 'github.dev@gmail.com',
          'X': 'x.innovator@x.com'
        };

        localStorage.setItem(
          'user_session', 
          JSON.stringify({ 
            email: emailMap[provider], 
            fullName: nameMap[provider],
            provider: provider.toLowerCase() 
          })
        );
        setSuccessMsg(`Authenticated successfully with ${provider}! Opening Workspace...`);
        setTimeout(() => {
          onSuccess();
        }, 800);
      }, 1000);
    }, 1200);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Basic Validations
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setLoadingMsg('Locating system accounts...');
      setTimeout(() => {
        setLoadingMsg(null);
        setSuccessMsg(`A secure recovery link has been dispatched to ${email}. Please check your inbox.`);
      }, 1200);
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('You must agree to the Terms of Service.');
        return;
      }

      setLoadingMsg('Provisioning startup database space...');
      
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users_database') || '[]');
        const exists = users.some((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase());

        if (exists) {
          setLoadingMsg(null);
          setErrorMsg('An account associated with this email already exists.');
          return;
        }

        // Add user to local DB
        users.push({ email, fullName, password });
        localStorage.setItem('users_database', JSON.stringify(users));

        // Create authentication session
        localStorage.setItem(
          'user_session', 
          JSON.stringify({ email, fullName, provider: 'email' })
        );

        setLoadingMsg(null);
        setSuccessMsg('Account provisioned successfully! Directing you to your workspace...');
        
        setTimeout(() => {
          onSuccess();
        }, 800);
      }, 1400);

    } else {
      // Handle Sign In mode
      if (!password) {
        setErrorMsg('Please supply your password.');
        return;
      }

      setLoadingMsg('Synchronizing secure database key...');

      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users_database') || '[]');
        
        const demoUser = { 
          email: 'demo@venture.studio', 
          fullName: 'Venture Founder', 
          password: 'password' 
        };
        
        const allUsers = [demoUser, ...users];
        const match = allUsers.find(
  (u: { email: string; password: string }) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!match) {
          setLoadingMsg(null);
          setErrorMsg('Incorrect email or password. Mock Demo: demo@venture.studio / password');
          return;
        }

        // Create active login session
        localStorage.setItem(
          'user_session', 
          JSON.stringify({ email: match.email, fullName: match.fullName, provider: 'email' })
        );

        setLoadingMsg(null);
        setSuccessMsg('Credential verified! Initiating workspace build...');
        
        setTimeout(() => {
          onSuccess();
        }, 800);
      }, 1200);
    }
  };

  const activeTab = mode === 'signup' ? 'signup' : 'login';

  return (
    <div className="w-full min-h-screen bg-[#F4F6FA] dark:bg-[#000000] text-[#0F172A] dark:text-[#FFFFFF] flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden font-sans select-none z-50 transition-colors duration-300">
      
      {/* Top Floating Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <button
          onClick={onExit}
          id="btn-auth-exit-home"
          className="flex items-center space-x-2 text-xs font-bold text-white hover:bg-[#252528] bg-[#343437] dark:text-[#A1A1AA] dark:hover:text-white dark:bg-[#111111] px-4 py-2 rounded-full border border-transparent dark:border-[#27272A] transition-all cursor-pointer group shadow-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Home</span>
        </button>

        {/* Theme Switching Button */}
        <button
          onClick={toggleTheme}
          id="btn-auth-theme-toggle"
          className="rounded-full p-2 text-white bg-[#343437] hover:bg-[#252528] dark:text-[#A1A1AA] dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-transparent dark:border-[#27272A] shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Structural Split Card Recreated visually from Reference Image */}
      <div className="w-full max-w-[850px] min-h-[530px] bg-[#FFFFFF] dark:bg-[#111111] border border-[#D1D5DB] dark:border-[#27272A] rounded-[24px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.08)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row relative z-10 transition-all duration-300 overflow-hidden md:overflow-visible my-12">
        
        {/* ==================== LEFT DECORATIVE PANEL ==================== */}
        <div className="w-full md:w-[38%] bg-[#F4F6FA] dark:bg-[#0A0A0A] p-6 sm:p-8 flex flex-col justify-between items-stretch relative min-h-[220px] md:min-h-full border-b md:border-b-0 border-[#D1D5DB] dark:border-[#27272A] rounded-t-[24px] md:rounded-tr-none md:rounded-l-[24px] overflow-hidden select-none">
          
          {/* Recreated 1:1 overlapping diagonal geometric chevron folds from the reference image */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#F4F6FA] dark:bg-[#0A0A0A]">
            {/* Layer 1: Background Base Diagonal */}
            <div className="absolute -top-[20%] -left-[30%] w-[130%] h-[120%] rotate-[-30deg] bg-[#FFFFFF] dark:bg-[#1A1A1F] opacity-30 dark:opacity-20 transition-all duration-300"></div>
            
            {/* Layer 2: Main Diagonal Ribbon folded from bottom-left to top-right */}
            <div className="absolute -bottom-[40%] -left-[20%] w-[120%] h-[110%] rotate-[35deg] bg-[#FFFFFF] dark:bg-[#18181B] shadow-[2px_-4px_24px_rgba(15,23,42,0.04)] dark:shadow-[2px_-4px_30px_rgba(0,0,0,0.4)] border-t border-[#D1D5DB]/20 dark:border-[#27272A]/10 transition-all duration-300"></div>

            {/* Layer 3: Intersecting Diagonal Ribbon from top-left to near center-right */}
            <div className="absolute -top-[35%] -left-[10%] w-[110%] h-[95%] -rotate-[35deg] bg-[#FFFFFF] dark:bg-[#111111] shadow-[4px_10px_30px_rgba(15,23,42,0.06)] dark:shadow-[4px_10px_40px_rgba(0,0,0,0.5)] border-b border-[#D1D5DB]/20 dark:border-zinc-800/10 transition-all duration-300"></div>
            
            {/* Layer 4: Accent Soft Ribbon highlight (Soft blue in light mode, primary blue highlight in dark mode) */}
            <div className="absolute top-[28%] -left-[35%] w-[130%] h-[15%] -rotate-[35deg] bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 transition-all duration-300"></div>

            {/* Layer 5: High Contrast Edge Highlighter */}
            <div className="absolute -bottom-[20%] -right-[15%] w-[60%] h-[120%] rotate-[45deg] bg-[#FFFFFF]/20 dark:bg-[#18181B]/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.01)] pointer-events-none"></div>
          </div>

          {/* Clean App Identifier */}
          <div className="flex items-center space-x-2.5 z-10 relative">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6] shadow-md shadow-blue-500/10">
              <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 12h10L10 22l10-10H10L12 2z" />
              </svg>
            </div>
            <span className="font-sans text-xs font-black tracking-widest text-[#0F172A] dark:text-[#FFFFFF] uppercase">
              Venture Studio
            </span>
          </div>

          {/* ================== INTERACTIVE SLIDING PENINSULA NOTCH (1:1 Layout) ================== */}
          {/* This container aligns perfectly along the vertical divider line */}
          <div className="hidden md:flex flex-col gap-3 items-end absolute right-0 top-1/2 -translate-y-1/2 z-20 w-[140px]">
            {/* Interactive Sliding Protrusion Tab Background */}
            <div 
              className="absolute right-0 w-[125px] h-[52px] bg-[#FFFFFF] dark:bg-[#111111] rounded-l-full shadow-[-6px_4px_12px_rgba(15,23,42,0.03)] dark:shadow-[-8px_4px_24px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out z-0"
              style={{
                transform: activeTab === 'login' ? 'translateY(0px)' : 'translateY(64px)',
              }}
            >
              {/* Concave fillet top edge */}
              <div className="absolute right-0 bottom-full w-4 h-4 bg-[#F4F6FA] dark:bg-[#0A0A0A] overflow-hidden pointer-events-none">
                <div className="w-full h-full bg-[#FFFFFF] dark:bg-[#111111] rounded-br-[16px]"></div>
              </div>
              {/* Concave fillet bottom edge */}
              <div className="absolute right-0 top-full w-4 h-4 bg-[#F4F6FA] dark:bg-[#0A0A0A] overflow-hidden pointer-events-none">
                <div className="w-full h-full bg-[#FFFFFF] dark:bg-[#111111] rounded-tr-[16px]"></div>
              </div>
            </div>

            {/* Selector Option Buttons */}
            <button
              onClick={() => handleSetMode('login')}
              id="tab-select-login"
              className={`relative w-full pr-10 h-[52px] flex items-center justify-end font-sans text-xs tracking-wider font-extrabold transition-all duration-300 z-10 cursor-pointer ${
                activeTab === 'login'
                  ? 'text-[#0F172A] dark:text-[#FFFFFF]'
                  : 'text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-white'
              }`}
            >
              <span>LOGIN</span>
            </button>

            <button
              onClick={() => handleSetMode('signup')}
              id="tab-select-signup"
              className={`relative w-full pr-10 h-[52px] flex items-center justify-end font-sans text-xs tracking-wider font-extrabold transition-all duration-300 z-10 cursor-pointer ${
                activeTab === 'signup'
                  ? 'text-[#0F172A] dark:text-[#FFFFFF]'
                  : 'text-[#475569] dark:text-[#A1A1AA] hover:text-[#3B82F6] dark:hover:text-white'
              }`}
            >
              <span>SIGN UP</span>
            </button>
          </div>

          {/* Mobile switcher representation */}
          <div className="flex md:hidden flex-row gap-2 bg-[#F4F6FA] dark:bg-zinc-800/40 p-1 rounded-xl z-20 relative mx-auto my-4 w-full max-w-[280px] border border-[#D1D5DB]/30 dark:border-transparent">
            <button
              onClick={() => handleSetMode('login')}
              id="btn-mobile-selector-login"
              className={`flex-1 py-1.5 text-center text-[10px] font-black tracking-wider rounded-lg transition-all relative z-10 cursor-pointer ${
                activeTab === 'login'
                  ? 'text-[#0F172A] dark:text-white font-[800]'
                  : 'text-[#475569] dark:text-[#A1A1AA]'
              }`}
            >
              <span className="relative z-10">LOGIN</span>
              {activeTab === 'login' && (
                <motion.div
                  layoutId="activeTabPillMobile"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute inset-0 bg-white dark:bg-[#111111] rounded-lg shadow-sm z-0"
                />
              )}
            </button>
            <button
              onClick={() => handleSetMode('signup')}
              id="btn-mobile-selector-signup"
              className={`flex-1 py-1.5 text-center text-[10px] font-black tracking-wider rounded-lg transition-all relative z-10 cursor-pointer ${
                activeTab === 'signup'
                  ? 'text-[#0F172A] dark:text-white font-[800]'
                  : 'text-[#475569] dark:text-[#A1A1AA]'
              }`}
            >
              <span className="relative z-10">SIGN UP</span>
              {activeTab === 'signup' && (
                <motion.div
                  layoutId="activeTabPillMobile"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  className="absolute inset-0 bg-white dark:bg-[#111111] rounded-lg shadow-sm z-0"
                />
              )}
            </button>
          </div>

          {/* Footer Identifier in Left Panel */}
          <div className="hidden md:flex items-center space-x-1.5 text-[9px] text-[#475569]/70 dark:text-[#A1A1AA]/60 font-mono tracking-widest z-10 justify-start">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>
            <span>SECURE GATEWAY v3.1</span>
          </div>
        </div>

        {/* ==================== RIGHT CONTENT PANEL ==================== */}
        <div className="w-full md:w-[62%] bg-[#FFFFFF] dark:bg-[#111111] p-6 sm:p-10 md:p-12 lg:p-14 flex flex-col justify-between relative rounded-b-[24px] md:rounded-bl-none md:rounded-r-[24px] min-h-[420px] z-10">
          
          <div className="my-auto">
            {/* Header circular avatar badge and title - exact match of reference image rendering */}
            {mode !== 'forgot' && (
              <div className="flex flex-col items-center text-center space-y-3 mb-8">
                <div className="w-18 h-18 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shadow-[0_8px_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform duration-300">
                  <User className="h-9 w-9 stroke-[1.8]" />
                </div>
                <h2 className="text-base font-sans font-black tracking-[0.18em] text-[#3B82F6] uppercase">
                  {mode === 'login' ? 'LOGIN' : 'SIGN UP'}
                </h2>
              </div>
            )}

            {/* Dynamic Alerts */}
            <div className="space-y-3 mb-4 max-w-sm mx-auto">
              {errorMsg && (
                <div id="auth-alert-error" className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 rounded-xl text-xs text-red-600 dark:text-red-400 font-bold animate-fade-in text-center">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div id="auth-alert-success" className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/40 dark:border-emerald-900/30 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-bold animate-fade-in text-center leading-relaxed">
                  {successMsg}
                </div>
              )}

              {loadingMsg && (
                <div id="auth-alert-loading" className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-900/20 rounded-xl flex items-center justify-center gap-2.5 text-xs text-blue-600 dark:text-blue-400 font-bold animate-fade-in">
                  <div className="h-3.5 w-3.5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
                  <span>{loadingMsg}</span>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="space-y-6"
              >
                
                {/* ==================== LOGIN FORM MODE ==================== */}
                {mode === 'login' && (
                  <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
                    {/* Email Horizontal Line Field matching 1:1 Reference Image */}
                    <div className="relative border-b border-[#D1D5DB] dark:border-[#27272A] focus-within:border-[#3B82F6] dark:focus-within:border-[#3B82F6] transition-colors duration-200 py-3 flex items-center bg-transparent">
                      <div className="flex items-center text-[#475569] dark:text-[#A1A1AA] mr-3">
                        <User className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                      <input
                        type="email"
                        required
                        id="input-login-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full text-xs font-semibold bg-transparent text-[#0F172A] dark:text-[#FFFFFF] outline-none placeholder:text-[#475569]/60 dark:placeholder:text-[#A1A1AA]/50"
                      />
                    </div>

                    {/* Password Horizontal Line Field */}
                    <div className="relative border-b border-[#D1D5DB] dark:border-[#27272A] focus-within:border-[#3B82F6] dark:focus-within:border-[#3B82F6] transition-colors duration-200 py-3 flex items-center bg-transparent">
                      <div className="flex items-center text-[#475569] dark:text-[#A1A1AA] mr-3">
                        <Lock className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                      <input
                        type="password"
                        required
                        id="input-login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full text-xs font-semibold bg-transparent text-[#0F172A] dark:text-[#FFFFFF] outline-none placeholder:text-[#475569]/60 dark:placeholder:text-[#A1A1AA]/50"
                      />
                    </div>

                    {/* Submit layout Row matching 1:1 image (Forgot Password on Left, pill button on Right) */}
                    <div className="flex items-center justify-between pt-2">
                       <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        id="btn-forgot-password-link"
                        className="text-xs font-semibold text-[#475569] hover:text-[#3B82F6] dark:text-[#A1A1AA] dark:hover:text-white transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        id="btn-auth-login-submit"
                        className="px-9 py-2.5 bg-[#3B82F6] text-white hover:bg-[#2563EB] rounded-full text-xs font-black tracking-wider transition-all cursor-pointer shadow-[0_4px_15px_rgba(59,130,246,0.25)] uppercase"
                      >
                        LOGIN
                      </motion.button>
                    </div>
                  </form>
                )}

                {/* ==================== SIGN UP FORM MODE ==================== */}
                {mode === 'signup' && (
                  <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
                    {/* Full Name Horizontal Line Field */}
                    <div className="relative border-b border-[#D1D5DB] dark:border-[#27272A] focus-within:border-[#3B82F6] dark:focus-within:border-[#3B82F6] transition-colors duration-200 py-2.5 flex items-center bg-transparent">
                      <div className="flex items-center text-[#475569] dark:text-[#A1A1AA] mr-3">
                        <User className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                      <input
                        type="text"
                        required
                        id="input-signup-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full text-xs font-semibold bg-transparent text-[#0F172A] dark:text-[#FFFFFF] outline-none placeholder:text-[#475569]/60 dark:placeholder:text-[#A1A1AA]/50"
                      />
                    </div>

                    {/* Email Horizontal Line Field */}
                    <div className="relative border-b border-[#D1D5DB] dark:border-[#27272A] focus-within:border-[#3B82F6] dark:focus-within:border-[#3B82F6] transition-colors duration-200 py-2.5 flex items-center bg-transparent">
                      <div className="flex items-center text-[#475569] dark:text-[#A1A1AA] mr-3">
                        <Mail className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                      <input
                        type="email"
                        required
                        id="input-signup-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full text-xs font-semibold bg-transparent text-[#0F172A] dark:text-[#FFFFFF] outline-none placeholder:text-[#475569]/60 dark:placeholder:text-[#A1A1AA]/50"
                      />
                    </div>

                    {/* Password Horizontal Line Field */}
                    <div className="relative border-b border-[#D1D5DB] dark:border-[#27272A] focus-within:border-[#3B82F6] dark:focus-within:border-[#3B82F6] transition-colors duration-200 py-2.5 flex items-center bg-transparent">
                      <div className="flex items-center text-[#475569] dark:text-[#A1A1AA] mr-3">
                        <Lock className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                      <input
                        type="password"
                        required
                        id="input-signup-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full text-xs font-semibold bg-transparent text-[#0F172A] dark:text-[#FFFFFF] outline-none placeholder:text-[#475569]/60 dark:placeholder:text-[#A1A1AA]/50"
                      />
                    </div>

                    {/* Confirm Password Horizontal Line Field */}
                    <div className="relative border-b border-[#D1D5DB] dark:border-[#27272A] focus-within:border-[#3B82F6] dark:focus-within:border-[#3B82F6] transition-colors duration-200 py-2.5 flex items-center bg-transparent">
                      <div className="flex items-center text-[#475569] dark:text-[#A1A1AA] mr-3">
                        <Lock className="h-4.5 w-4.5 stroke-[2]" />
                      </div>
                      <input
                        type="password"
                        required
                        id="input-signup-confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full text-xs font-semibold bg-transparent text-[#0F172A] dark:text-[#FFFFFF] outline-none placeholder:text-[#475569]/60 dark:placeholder:text-[#A1A1AA]/50"
                      />
                    </div>

                    {/* Agreement check */}
                    <div className="flex items-start gap-2 pt-1">
                      <div className="relative flex items-center mt-0.5">
                        <input
                          id="agree-terms"
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="peer h-4 w-4 opacity-0 absolute cursor-pointer z-10"
                        />
                        <div className="h-4 w-4 rounded border border-[#D1D5DB] dark:border-zinc-700 bg-transparent flex items-center justify-center peer-checked:bg-[#3B82F6] peer-checked:border-[#3B82F6] transition-all">
                          <Check className="h-3 w-3 text-white stroke-[3.5]" />
                        </div>
                      </div>
                      <label htmlFor="agree-terms" className="text-[10px] text-[#475569] dark:text-[#A1A1AA] font-sans cursor-pointer select-none">
                        I agree to the <span className="font-bold text-[#3B82F6] hover:underline">Terms of Service</span>
                      </label>
                    </div>

                    {/* Action pill button on Right */}
                    <div className="flex justify-end pt-2">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        id="btn-auth-signup-submit"
                        className="px-9 py-2.5 bg-[#3B82F6] text-white hover:bg-[#2563EB] rounded-full text-xs font-black tracking-wider transition-all cursor-pointer shadow-[0_4px_15px_rgba(59,130,246,0.25)] uppercase"
                      >
                        Create Account
                      </motion.button>
                    </div>
                  </form>
                )}

                {/* ==================== FORGOT PASSWORD MODE ==================== */}
                {mode === 'forgot' && (
                  <div className="space-y-6 max-w-sm mx-auto">
                    <div className="space-y-1 text-center sm:text-left">
                      <h1 className="text-lg font-black tracking-tight text-[#0F172A] dark:text-white">
                        Reset Password
                      </h1>
                      <p className="text-xs text-[#475569] dark:text-[#A1A1AA] font-medium leading-relaxed">
                        Verify your email address to receive a secure password recovery linkage.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="relative border-b border-[#D1D5DB] dark:border-[#27272A] focus-within:border-[#3B82F6] dark:focus-within:border-[#3B82F6] transition-colors duration-200 py-3 flex items-center bg-transparent">
                        <div className="flex items-center text-[#475569] dark:text-[#A1A1AA] mr-3">
                          <Mail className="h-4.5 w-4.5 stroke-[2]" />
                        </div>
                        <input
                          type="email"
                          required
                          id="input-forgot-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full text-xs font-semibold bg-transparent text-[#0F172A] dark:text-[#FFFFFF] outline-none placeholder:text-[#475569]/60 dark:placeholder:text-[#A1A1AA]/50"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => handleSetMode('login')}
                          id="btn-back-to-login"
                          className="text-xs font-bold text-[#3B82F6] hover:underline cursor-pointer"
                        >
                          Back to Login
                        </button>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          id="btn-forgot-submit"
                          className="px-8 py-2.5 bg-[#3B82F6] text-white hover:bg-[#2563EB] rounded-full text-xs font-black tracking-wider transition-all cursor-pointer shadow-[0_4px_15px_rgba(59,130,246,0.25)] uppercase"
                        >
                          Dispatch Link
                        </motion.button>
                      </div>
                    </form>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* ==================== 1:1 RECREATED SOCIAL BAR FOOTER ==================== */}
          <div className="mt-8 pt-6 border-t border-[#D1D5DB] dark:border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* L: Identical Label Placement */}
            <span className="text-[11px] font-bold text-[#475569] dark:text-[#A1A1AA] uppercase tracking-wider">
              Or Login With
            </span>
            {/* R: Identical Horizontal social connections */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                id="btn-social-oauth-google"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1D5DB] dark:border-[#27272A] bg-transparent hover:bg-[#F4F6FA] dark:hover:bg-[#18181B] text-[#0F172A] dark:text-[#FFFFFF] text-[11px] font-bold transition-all cursor-pointer shadow-sm"
              >
                <Chrome className="h-3.5 w-3.5 text-[#3B82F6]" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                id="btn-social-oauth-github"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1D5DB] dark:border-[#27272A] bg-transparent hover:bg-[#F4F6FA] dark:hover:bg-[#18181B] text-[#0F172A] dark:text-[#FFFFFF] text-[11px] font-bold transition-all cursor-pointer shadow-sm"
              >
                <Github className="h-3.5 w-3.5 text-[#0F172A] dark:text-zinc-200" />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('X')}
                id="btn-social-oauth-x"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1D5DB] dark:border-[#27272A] bg-transparent hover:bg-[#F4F6FA] dark:hover:bg-[#18181B] text-[#0F172A] dark:text-[#FFFFFF] text-[11px] font-bold transition-all cursor-pointer shadow-sm"
              >
                <svg className="h-3.5 w-3.5 text-[#0F172A] dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X / Twitter</span>
              </button>
            </div>
          </div>

          {/* Discreet Sandbox Credentials Help */}
          {mode === 'login' && (
            <div className="mt-3 bg-[#F4F6FA]/60 dark:bg-[#18181B]/40 rounded-lg p-2 border border-[#D1D5DB]/30 dark:border-[#27272A]/40 text-center text-[10px] text-[#475569] dark:text-[#A1A1AA] font-semibold font-mono">
              Demo sandbox login: <span className="text-[#3B82F6] font-bold">demo@venture.studio</span> / <span className="text-[#3B82F6] font-bold">password</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

