"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual signup logic
    console.log("Signup with:", email, password);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f0ede6] dark:bg-[#121212] font-sans transition-colors duration-500 selection:bg-[#4dd0e1]/30">
      
      {/* Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between z-40">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded shadow-inner bg-[#3d4554] border border-white/10 flex items-center justify-center text-[#e2e8f0] group-hover:scale-105 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L13 8L17 12" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16H17" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-semibold text-slate-800 dark:text-[#e2e8f0] tracking-tight">SlateCanvas</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-md p-8 sm:p-10 rounded-2xl shadow-xl dark:shadow-2xl bg-white dark:bg-[#1e232b] border border-slate-200 dark:border-white/5 transition-all overflow-hidden">
          
          {/* Subtle noise overlay for dark mode to match slate theme */}
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none hidden dark:block" 
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
              backgroundRepeat: 'repeat'
            }} 
          />

          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#f8fafc]">Create an account</h1>
              <p className="text-sm text-slate-600 dark:text-[#cbd5e1]/80">Join SlateCanvas to save and share your boards.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-[#e2e8f0]">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4dd0e1]/50 focus:border-transparent transition-all dark:text-white dark:placeholder-white/30"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-[#e2e8f0]">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4dd0e1]/50 focus:border-transparent transition-all dark:text-white dark:placeholder-white/30"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#2A313C] dark:bg-[#e2e8f0] text-white dark:text-[#1e293b] font-bold shadow-md hover:-translate-y-0.5 transition-all active:translate-y-0.5"
              >
                Sign Up
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#1e232b] text-slate-500 dark:text-[#cbd5e1]/60">Or</span>
              </div>
            </div>

            {/* Guest Flow */}
            <div className="space-y-3">
              <Link 
                href="/board/guest" // Assuming /board is where the canvas will live
                className="w-full flex justify-center py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#e2e8f0] font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                Continue as Guest
              </Link>
              <p className="text-xs text-center text-amber-600 dark:text-amber-400/80 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-200 dark:border-amber-500/20">
                <span className="font-semibold block mb-1">⚠️ Guest Mode Limitation</span>
                As a guest, you will not be able to securely save, sync across devices, or share boards perfectly. Your work may be lost when you close the tab.
              </p>
            </div>

            <p className="text-sm text-center text-slate-600 dark:text-[#cbd5e1]/80 pt-2">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#4dd0e1] hover:underline underline-offset-2">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
