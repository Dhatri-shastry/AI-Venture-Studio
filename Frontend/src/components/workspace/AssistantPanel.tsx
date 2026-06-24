"use client";

import Image from "next/image";

export default function AssistantPanel() {
  return (
    <aside className="w-[320px] bg-[#f8f8f8] dark:bg-[#121212] border-l border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Image
          src="/robot.png"
          alt="robot"
          width={220}
          height={220}
        />

        <h2 className="font-bold text-2xl mt-6">
          Venture Assistant
        </h2>

        <p className="text-center text-gray-500 mt-3">
          Your AI co-founder for startup validation,
          research and execution.
        </p>
      </div>
    </aside>
  );
}