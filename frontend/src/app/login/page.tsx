"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.BACKEND_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      // Store token and redirect
      localStorage.setItem("token", data.access_token);
      window.location.href = "/dashboard"; // Redirect to dashboard after login
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PhysicalSlateWrapper showFooter={true}>
      {/* Header */}
      <header className="relative w-full z-40 px-4 sm:px-10 py-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded shadow-inner bg-slate-100 dark:bg-[#3d4554] border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-[#e2e8f0]">
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L13 8L17 12" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg sm:text-2xl font-semibold text-slate-800 dark:text-[#e2e8f0] tracking-tight text-shadow-sm transition-colors">SlateCanvas</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 w-full max-w-md mx-auto">
        <div className="relative w-full p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] bg-white/90 dark:bg-[#1e232b]/80 backdrop-blur-md border border-slate-200 dark:border-white/5 transition-all overflow-hidden flex flex-col items-center">
          
          <div className="relative z-10 space-y-10 w-full">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#f8fafc]" style={{textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>Welcome back</h1>
              <p className="text-[10px] text-slate-500 dark:text-[#cbd5e1]/50 tracking-widest uppercase font-bold">Log in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold py-2 px-3 rounded-lg text-center animate-shake">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300 ml-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sohamsahare"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#f0f4f8] border border-slate-100 dark:border-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-[#ff8a65]/50 transition-all text-slate-900 dark:text-[#1e232b] placeholder-slate-300 dark:placeholder-[#1e232b]/30 font-medium disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300">Password</label>
                  <Link href="/forgot-password" className="text-[10px] font-bold text-amber-600 dark:text-[#ff8a65] hover:underline uppercase tracking-wider transition-colors">Forgot?</Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#f0f4f8] border border-slate-100 dark:border-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-[#ff8a65]/50 transition-all text-slate-900 dark:text-[#1e232b] placeholder-slate-300 dark:placeholder-[#1e232b]/30 font-medium disabled:opacity-50"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 rounded-2xl bg-amber-600 dark:bg-[#ff8a65] text-white dark:text-[#1e293b] font-black text-xs uppercase tracking-widest shadow-lg dark:shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)] hover:bg-amber-700 dark:hover:bg-[#ffab91] hover:-translate-y-0.5 transition-all active:translate-y-0.5 active:shadow-none disabled:opacity-50 disabled:translate-y-0"
              >
                {isLoading ? "Logging In..." : "Log In"}
              </button>
            </form>

            <p className="text-xs text-center text-slate-400 dark:text-[#cbd5e1]/40 font-medium tracking-wide pt-2">
              Don't have an account?{" "}
              <Link href="/signup" className="font-bold text-amber-600 dark:text-[#ff8a65] hover:underline underline-offset-4 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </PhysicalSlateWrapper>
  );
}
