"use client";

import {
  User,
  Mail,
  Lock,
  Sun,
  Moon,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  signInWithPopup
} from "firebase/auth";

import {
  auth,
  googleProvider,
  githubProvider
} from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthCard() {
  const [isLogin, setIsLogin] = useState(true);
  const [dark, setDark] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const router = useRouter();
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const token =
      await result.user.getIdToken();

    localStorage.setItem(
      "token",
      token
    );

    router.push("/workspace");
  } catch (error) {
    console.error(error);
  }
};

const handleGithubLogin = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      githubProvider
    );

    const token =
      await result.user.getIdToken();

    localStorage.setItem(
      "token",
      token
    );

    router.push("/workspace");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div
  className={`min-h-screen overflow-y-auto flex items-center justify-center transition-all duration-500 px-4 py-10
      ${
        dark
          ? "bg-black text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className={`absolute top-8 right-8 p-3 rounded-full transition
        ${
          dark
            ? "bg-zinc-900 border border-zinc-700"
            : "bg-white shadow-md"
        }`}
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Back Button */}
<button
  onClick={() => router.push("/")}
  className={`absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full transition
  ${
    dark
      ? "bg-zinc-900 border border-zinc-700 hover:bg-zinc-800"
      : "bg-white shadow-md hover:bg-slate-50"
  }`}
>
  <ArrowLeft size={18} />
  Back
</button>

      {/* Main Card */}
      <div
        className={`w-full max-w-5xl min-h-[650px] rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2
        ${
          dark
            ? "bg-zinc-950 border border-zinc-800"
            : "bg-white"
        }`}
      >
        {/* LEFT PANEL */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400">
        
          {/* Decorative Shapes */}
          <div className="absolute -left-16 top-0 w-72 h-72 rotate-45 bg-blue-500/20" />

          <div className="absolute -left-10 top-16 w-64 h-64 rotate-45 bg-blue-600/30" />

          <div className="absolute left-10 top-40 w-72 h-72 rotate-45 bg-white/10 backdrop-blur-md" />

        

          {/* Login / Signup Switch */}
          <div className="absolute left-14 top-1/2 -translate-y-1/2">
            <div className="space-y-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`px-8 py-4 rounded-r-full font-semibold transition
                ${
                  isLogin
                    ? "bg-white text-black shadow-xl"
                    : "text-white"
                }`}
              >
                LOGIN
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`block px-8 py-4 rounded-r-full font-semibold transition
                ${
                  !isLogin
                    ? "bg-white text-black shadow-xl"
                    : "text-white"
                }`}
              >
                SIGN UP
              </button>
            </div>
          </div>
        </div>


        {/* RIGHT PANEL */}
        <div
          className={`flex flex-col justify-center px-12
          ${dark ? "bg-zinc-950" : "bg-white"}`}
        >
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg
              ${
                dark
                  ? "bg-blue-600"
                  : "bg-blue-500"
              }`}
            >
              <User size={34} color="white" />
            </div>
          </div>

  <>
  <h2 className="text-center text-4xl font-bold">
    {isLogin ? "LOGIN" : "SIGN UP"}
  </h2>

  <p
    className={`text-center text-sm mb-8 mt-3 ${
      dark ? "text-zinc-400" : "text-slate-500"
    }`}
  >
    Secure access to your AI Venture Workspace
  </p>
</>

          {/* Email */}
          <div className="relative mb-6">
            <Mail
              className="absolute left-0 top-3"
              size={18}
            />
            <input
              type="email"
              placeholder="Email"
              className={`w-full border-b pl-8 py-2 bg-transparent outline-none
              ${
                dark
                  ? "border-zinc-700"
                  : "border-slate-300"
              }`}
            />
          </div>

          {/* Password */}
          <div className="relative mb-6">
  <Lock className="absolute left-0 top-3" size={18} />

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    className={`w-full border-b pl-8 pr-10 py-2 bg-transparent outline-none
    ${
      dark
        ? "border-zinc-700"
        : "border-slate-300"
    }`}
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-2 top-2"
  >
    {showPassword ? (
      <EyeOff size={18} />
    ) : (
      <Eye size={18} />
    )}
  </button>
</div>

          {/* Confirm Password */}

  {!isLogin && (
  <div className="relative mb-6">
    <Lock className="absolute left-0 top-3" size={18} />

    <input
      type={showConfirmPassword ? "text" : "password"}
      placeholder="Confirm Password"
      className={`w-full border-b pl-8 pr-10 py-2 bg-transparent outline-none
      ${
        dark
          ? "border-zinc-700"
          : "border-slate-300"
      }`}
    />

    <button
      type="button"
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
      className="absolute right-2 top-2"
    >
      {showConfirmPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  </div>
)}

{isLogin && (
  <div className="flex justify-between items-center mb-6">
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="accent-blue-600"
      />
      Remember Me
    </label>

    <button className="text-sm text-blue-500">
      Forgot Password?
    </button>
  </div>
)}

{!isLogin && (
  <label className="flex items-center gap-2 text-sm mb-6">
    <input
      type="checkbox"
      className="accent-blue-600"
    />
    I agree to the Terms & Conditions
  </label>
)}

<div className="flex justify-end">
  <button
    className="px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
  >
    {isLogin ? "LOGIN" : "SIGN UP"}
  </button>
</div>


          {/* Social Login */}
<div className="mt-8">

  <div className="flex items-center gap-4 mb-6">
    <div
      className={`flex-1 h-px ${
        dark ? "bg-zinc-700" : "bg-slate-300"
      }`}
    />

    <span className="text-sm opacity-70">
      Or Continue With
    </span>

    <div
      className={`flex-1 h-px ${
        dark ? "bg-zinc-700" : "bg-slate-300"
      }`}
    />
  </div>

  {/* Social Buttons */}
  <div className="grid grid-cols-2 gap-4">

    <button
   onClick={handleGoogleLogin}
  className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition
  ${
    dark
      ? "border-zinc-700 hover:bg-zinc-900"
      : "border-slate-200 hover:bg-slate-50"
  }`}
>
  <FcGoogle size={22} />
  <span>Google</span>
</button>

    <button
    onClick={handleGithubLogin}
      className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition
      ${
        dark
          ? "border-zinc-700 hover:bg-zinc-900"
          : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      <FaGithub className="text-lg" />
      <span>GitHub</span>
    </button>

  </div>

  {/* Login / Signup Switch */}
  <div className="text-center mt-8 text-sm">
    {isLogin ? (
      <>
        Don't have an account?{" "}
        <button
          onClick={() => setIsLogin(false)}
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          Create Account
        </button>
      </>
    ) : (
      <>
        Already have an account?{" "}
        <button
          onClick={() => setIsLogin(true)}
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          Login
        </button>
      </>
    )}
  </div>

</div>

        </div>
      </div>
    </div>
  );
};