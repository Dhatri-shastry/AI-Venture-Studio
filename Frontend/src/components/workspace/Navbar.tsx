"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="
      h-16
      border-b
      flex
      items-center
      justify-between
      px-6
      "
      style={{
        borderColor: "var(--border)",
      }}
    >
      <h2 className="font-semibold text-lg">
        New Chat
      </h2>

      <button
        onClick={() =>
          setTheme(theme === "dark" ? "light" : "dark")
        }
        className="
        w-10
        h-10
        rounded-xl
        flex
        items-center
        justify-center
        transition
        hover:scale-105
        "
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
        }}
      >
        {theme === "dark" ? (
          <Sun size={18} />
        ) : (
          <Moon size={18} />
        )}
      </button>
    </header>
  );
}