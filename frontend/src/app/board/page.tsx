"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";

export default function BoardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token && window.location.pathname !== "/board/guest") {
      // For now, allow viewing but in a real app we might redirect
      // window.location.href = "/login";
    }

    // Try to decode email from token (mock for now or simpler: just check localStorage)
    // In a real app we'd decode the JWT
    setUserEmail("sohamsahare"); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <PhysicalSlateWrapper showFooter={false}>
      {/* Header */}
      <header className="relative w-full z-40 px-4 sm:px-10 py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 rounded shadow-inner bg-slate-100 dark:bg-[#3d4554] border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-[#e2e8f0] group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L13 8L17 12" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-semibold text-slate-800 dark:text-[#e2e8f0] tracking-tight transition-colors">SlateCanvas</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 dark:text-slate-400">Collaborating</span>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={handleLogout}
              className="text-[10px] uppercase tracking-widest font-black text-amber-600 dark:text-[#ff8a65] hover:opacity-70 transition-opacity"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 relative flex flex-col p-4 sm:p-6 overflow-hidden">
        {/* Toolbar Placeholder */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 p-2 rounded-2xl bg-white/90 dark:bg-[#1e232b]/80 backdrop-blur-md border border-slate-200 dark:border-white/5 shadow-xl">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-amber-100 dark:hover:bg-amber-500/20 cursor-pointer transition-colors flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600"></div>
            </div>
          ))}
        </div>

        {/* The Actual "Infinite" Board Surface */}
        <div className="flex-1 w-full rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="relative z-10 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 dark:bg-[#ff8a65]/10 flex items-center justify-center mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-amber-600 dark:text-[#ff8a65]">
                <path d="M12 19L19 12L22 15L15 22L12 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 13L16.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 22L5 21L18.5 7.5L15.5 4.5L2 18V22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.5 6.5L16.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2L20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter text-slate-800 dark:text-[#f8fafc] opacity-20">Your Infinite Canvas</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 dark:text-slate-500">Pick a tool to start your first Slate</p>
          </div>
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
               style={{backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        </div>
      </main>
    </PhysicalSlateWrapper>
  );
}
