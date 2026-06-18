"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AppScreen, Theme } from "../types";

interface NavbarProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  theme: Theme;
  toggleTheme: () => void;
}

export default function Navbar({
  currentScreen,
  setScreen,
  theme,
  toggleTheme,
}: NavbarProps) {
  const items = [
    { label: "Product", id: "main-navbar" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Features", id: "features" },
  ];

  const router = useRouter();

  const handleScroll = (id: string) => {
    if (id === "footer") {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
      return;
    }

    if (currentScreen !== AppScreen.Landing) {
      setScreen(AppScreen.Landing);

      setTimeout(() => {
        if (id === "main-navbar") {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } else {
          const el = document.getElementById(id);

          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
            });
          }
        }
      }, 100);
    } else {
      if (id === "main-navbar") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        const el = document.getElementById(id);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    }
  };

  return (
    <nav
      id="main-navbar"
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300
      bg-white/80 border-[#E2E8F0]
      dark:bg-[#050505]/80 dark:border-[#1E1E1E]"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div
          onClick={() => setScreen(AppScreen.Landing)}
          data-cursor="Portal"
          className="group flex cursor-pointer items-center space-x-2.5"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
            <svg
              className="h-5 w-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 12h10L10 22l10-10H10L12 2z" />
            </svg>

            <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 blur transition-all duration-300 group-hover:opacity-30" />
          </div>

          <span className="font-display text-lg font-bold tracking-tight text-gray-900 transition-colors dark:text-white">
            AI Venture{" "}
            <span className="font-light text-blue-500">Studio</span>
          </span>
        </div>

        {/* Navigation */}
        {currentScreen === AppScreen.Landing && (
          <div className="hidden items-center space-x-8 md:flex">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleScroll(item.id)}
                data-cursor="Scroll"
                className="relative cursor-pointer py-1 text-sm font-medium text-gray-500 transition-all hover:text-black after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-500 after:transition-all hover:after:w-full dark:text-gray-400 dark:hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            id="theme-toggle"
            data-cursor="Toggle"
            className="cursor-pointer rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {currentScreen === AppScreen.Landing ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push("/auth?mode=login")}
                data-cursor="Enter"
                className="cursor-pointer rounded-full border border-zinc-900 bg-transparent px-5 py-2.5 text-xs font-extrabold text-zinc-900 transition-all hover:bg-zinc-50 dark:border-white dark:text-white dark:hover:bg-zinc-900 sm:text-sm"
              >
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push("/auth?mode=signup")}
                data-cursor="Join"
                className="cursor-pointer rounded-full border border-transparent bg-zinc-900 px-5 py-2.5 text-xs font-extrabold text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 sm:text-sm"
              >
                Sign Up
              </motion.button>
            </div>
          ) : (
            <button
              onClick={() => router.push("/")}
              data-cursor="Portal"
              className="cursor-pointer rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-900"
            >
              Exit to Portal
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}