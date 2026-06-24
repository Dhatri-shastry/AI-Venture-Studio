"use client";

import Navbar from "./Navbar";
import MessageInput from "./MessageInput";

export default function ChatArea() {
  return (
    <section className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#0b0b0b]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            AI Venture Studio
          </h1>

          <p className="text-gray-500">
            Build, Validate and Scale Startups with AI
          </p>
        </div>
      </div>

      <MessageInput />
    </section>
  );
}