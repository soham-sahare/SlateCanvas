"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";

import { Whiteboard } from "@/components/Whiteboard";

export default function BoardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token && typeof window !== "undefined" && window.location.pathname !== "/board/guest") {
      // For now, allow viewing but in a real app we might redirect
      // window.location.href = "/login";
    }

    setUserEmail("sohamsahare"); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
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
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 dark:text-slate-400">Collaboration Ready</span>
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
        <main className="flex-1 relative flex flex-col p-3 sm:p-4 overflow-hidden">
          <div className="flex-1 w-full rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 relative overflow-hidden bg-[#fafafa]/20 dark:bg-black/10">
            <Whiteboard />
          </div>
        </main>
      </PhysicalSlateWrapper>
    </div>
  );
}
