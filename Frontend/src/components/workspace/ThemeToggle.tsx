"use client";
// This file is the ThemeToggle component
import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  className?: string;
}

export default function ThemeToggle({ theme, toggleTheme, className }: ThemeToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`flex items-center justify-center rounded-full p-1 transition-colors ${className || ""}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
