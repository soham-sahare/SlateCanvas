"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";

export default function Home() {
  return (
    <PhysicalSlateWrapper showFooter={true}>
      {/* Header */}
      <header className="relative w-full z-40 px-4 sm:px-10 py-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          {/* Slate Canvas Logo - Custom SVG */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded shadow-inner bg-slate-100 dark:bg-[#3d4554] border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-[#e2e8f0]">
            <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L13 8L17 12" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-lg sm:text-2xl font-semibold text-slate-800 dark:text-[#e2e8f0] tracking-tight" style={{textShadow: '0 1px 2px rgba(0,0,0,0.1)'}}>SlateCanvas</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-6">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 sm:px-6 py-2 font-medium text-[10px] sm:text-xs uppercase tracking-widest rounded border border-cyan-500/30 dark:border-[#4dd0e1]/30 text-cyan-600 dark:text-[#4dd0e1] hover:bg-cyan-500/5 dark:hover:bg-[#4dd0e1]/5 hover:border-cyan-500/60 dark:hover:border-[#4dd0e1]/60 transition-all whitespace-nowrap"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-10 text-center relative z-10 -mt-12">
        <div className="max-w-screen-lg mx-auto space-y-12">
          
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-cyan-600 dark:text-[#4dd0e1] tracking-widest uppercase text-[10px] font-bold shadow-sm backdrop-blur-sm transition-all">
              <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-[#4dd0e1] animate-pulse"></span>
              <span>The Collaborative Whiteboard</span>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Hand-drawn aesthetic typography */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 dark:text-[#f8fafc] leading-[1.05]" style={{textShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
              A clean <span className="text-[#ff8a65] italic font-serif">Slate.</span><br />
              An endless <span className="text-[#0891b2] dark:text-[#4dd0e1] italic font-serif">Canvas.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-[#cbd5e1]/70 leading-relaxed font-light">
              The beautifully simple canvas where teams think and build together.
            </p>
          </div>
          
          <div className="pt-4 flex flex-col items-center justify-center">
            <Link
              href="/signup"
              className="px-12 py-4 rounded-lg bg-amber-600 dark:bg-[#ff8a65] text-white dark:text-[#1e293b] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-amber-700 dark:hover:bg-[#ffab91] hover:-translate-y-0.5 transition-all active:translate-y-0.5"
            >
              Start Drawing
            </Link>
          </div>
        </div>
      </main>
    </PhysicalSlateWrapper>
  );
}
