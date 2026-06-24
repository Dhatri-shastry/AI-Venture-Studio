"use client";

import LoginCard from "@/components/LoginCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const LoginCardAny = LoginCard as any;

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode =
    searchParams.get("mode") === "signup"
      ? "signup"
      : "login";

  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <LoginCardAny
      initialMode={mode}
      theme={theme}
      toggleTheme={() =>
        setTheme(theme === "light" ? "dark" : "light")
      }
      onExit={() => router.push("/")}
      onSuccess={() => router.push("/dashboard")}
    />
  );
}