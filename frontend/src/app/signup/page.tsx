"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual signup logic
    console.log("Signup with:", email, password);
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
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#f8fafc]" style={{textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>Create an account</h1>
              <p className="text-[10px] text-slate-500 dark:text-[#cbd5e1]/50 tracking-widest uppercase font-bold text-center px-4">Join SlateCanvas to save and share boards.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300 ml-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sohamsahare"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#f0f4f8] border border-slate-100 dark:border-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#4dd0e1]/50 transition-all text-slate-900 dark:text-[#1e232b] placeholder-slate-300 dark:placeholder-[#1e232b]/30 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-300 ml-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#f0f4f8] border border-slate-100 dark:border-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-[#4dd0e1]/50 transition-all text-slate-900 dark:text-[#1e232b] placeholder-slate-300 dark:placeholder-[#1e232b]/30 font-medium"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-4 px-4 rounded-2xl bg-amber-600 dark:bg-[#ff8a65] text-white dark:text-[#1e293b] font-black text-xs uppercase tracking-widest shadow-lg dark:shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)] hover:bg-amber-700 dark:hover:bg-[#ffab91] hover:-translate-y-0.5 transition-all active:translate-y-0.5 active:shadow-none"
              >
                Sign Up
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold text-slate-300 dark:text-white/10">
                <span className="px-3 bg-white dark:bg-[#1e232b] transition-colors">Or</span>
              </div>
            </div>

            {/* Guest Flow */}
            <div className="space-y-4">
              <Link 
                href="/board/guest"
                className="w-full flex flex-col items-center justify-center py-4 px-4 rounded-2xl border border-slate-200 dark:border-white/5 text-slate-800 dark:text-[#e2e8f0] bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm group"
              >
                <span className="font-bold text-xs uppercase tracking-widest">Continue as Guest</span>
                <span className="text-[9px] text-amber-600 dark:text-amber-500/60 leading-relaxed mt-1 font-medium">
                  ⚠️ Guest Mode work may be lost when you close the tab.
                </span>
              </Link>
            </div>

            <p className="text-xs text-center text-slate-400 dark:text-[#cbd5e1]/40 font-medium tracking-wide pt-2">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-amber-600 dark:text-[#ff8a65] hover:underline underline-offset-4 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </PhysicalSlateWrapper>
  );
}
