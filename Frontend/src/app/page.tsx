"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import LaptopShowcase from "@/components/LaptopShowcase";
import ArchitectureFlow from "@/components/ArchitectureFlow";
import FeatureShowcase from "@/components/FeatureShowcase";
import HowItWorks from "@/components/HowItWorks";
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";

import { AppScreen, Theme } from "@/types";

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 ${
        theme === "dark"
          ? "bg-[#050505] text-white"
          : "bg-[#F8FAFC] text-[#111827]"
      }`}
    >
      <CustomCursor theme={theme} />

      <Navbar
        currentScreen={AppScreen.Landing}
        setScreen={() => {}}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[130px] dark:bg-blue-600/5 pointer-events-none" />

        <div className="max-w-4xl mx-auto">
          <h1 className="font-sans text-[32px] sm:text-[44px] md:text-[56px] font-[800] tracking-[-0.03em] leading-none mb-4">
            Build, Validate and Scale Startups{" "}
            <span className="text-[#3B82F6]">with AI</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-medium max-w-[700px] mx-auto mb-8 leading-[1.6] text-slate-500 dark:text-zinc-400">
            Research markets, analyze competitors, generate documentation,
            validate ideas and prepare investor-ready ventures in one
            AI-powered workspace.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
  <button
    onClick={() => router.push("/auth?mode=signup")}
    className="
      px-10 py-6
      rounded-full
      bg-blue-600
      hover:bg-blue-700
      text-white
      font-bold
      text-sm md:text-base
      transition-all
      duration-300
      shadow-lg shadow-blue-500/20
      hover:scale-105
    "
  >
    Get Started
  </button>
</div>
      </section>

      {/* Laptop Showcase */}
      <section className="relative max-w-7xl mx-auto mb-16 z-20">
        <div className="max-w-6xl mx-auto laptop_anchor">
          <LaptopShowcase theme={theme} />
        </div>
      </section>

      {/* Architecture Flow */}
       <ArchitectureFlow /> 

      {/* How It Works */}
      <HowItWorks theme={theme} />

      {/* Features */}
      <section
        id="features"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 border-t border-[#E2E8F0] dark:border-[#1E1E1E]"
      >
        <div className="max-w-xl mx-auto text-center mb-16 space-y-2.5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#3B82F6] font-mono">
            CORE CAPABILITIES WORKFLOW
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
            Venture validation, step-by-step.
          </h2>
        </div>

         <FeatureShowcase theme={theme} /> 
      </section>

      {/* Footer */}
      <Footer theme={theme} setTheme={setTheme} />
    </div>
  );
}