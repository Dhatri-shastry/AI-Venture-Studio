"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CustomCursorProps {
  theme: "light" | "dark";
}

export default function CustomCursor({
  theme,
}: CustomCursorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = {
    damping: 30,
    stiffness: 350,
  };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    if (isTouch) return;

    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target) return;

      const hoverNode =
        target.closest("[data-cursor]") ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".card") ||
        target.closest(".laptop_anchor") ||
        target.closest('[role="button"]') ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select");

      setIsHovered(Boolean(hoverNode));
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  const cursorColor =
    theme === "dark" ? "#FFFFFF" : "#111111";

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorXSpring,
        top: cursorYSpring,
        x: "-50%",
        y: "-50%",
        pointerEvents: "none",
        zIndex: 99999,
      }}
      className="hidden lg:block font-sans"
    >
      <motion.div
        animate={{
          width: isHovered ? 20 : 8,
          height: isHovered ? 20 : 8,
          backgroundColor: cursorColor,
          opacity: isHovered ? 0.15 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28,
        }}
        className="rounded-full"
      />
    </motion.div>
  );
}