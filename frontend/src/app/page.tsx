"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";

export default function Home() {
  return (
    <PhysicalSlateWrapper showFooter={true}>
      {/* Header */}
      <header className="relative w-full z-40 px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Slate Canvas Logo - Custom SVG */}
          <div className="w-10 h-10 rounded shadow-inner bg-[#3d4554] border border-white/10 flex items-center justify-center text-[#e2e8f0]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L13 8L17 12" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16H17" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-2xl font-semibold text-[#e2e8f0] tracking-tight" style={{textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>SlateCanvas</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-6 py-2.5 font-medium text-sm rounded border-2 border-[#ffb74d]/40 text-[#ffb74d] hover:bg-[#ffb74d]/10 hover:border-[#ffb74d] transition-all"
            style={{textShadow: '0 1px 2px rgba(0,0,0,0.2)'}}
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-10 text-center relative z-10 pt-10">
        <div className="max-w-screen-lg mx-auto space-y-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[#4dd0e1] tracking-wider uppercase text-xs font-semibold shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#4dd0e1]"></span>
            <span>The Collaborative Whiteboard</span>
          </div>
          
          {/* Hand-drawn aesthetic typography (using standard fonts but pastel colors) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#f8fafc] leading-[1.1]" style={{textShadow: '0 2px 10px rgba(255,255,255,0.1)'}}>
            A clean <span className="text-[#ff8a65] italic font-serif">Slate.</span><br />
            An endless <span className="text-[#4dd0e1] italic font-serif">Canvas.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#cbd5e1] leading-relaxed font-light">
            The beautifully simple canvas where teams think and build together.
          </p>
          
          <div className="pt-6 flex flex-col items-center justify-center">
            <Link
              href="/signup"
              className="px-10 py-4 rounded bg-[#e2e8f0] text-[#1e293b] font-bold text-lg shadow-[inset_0_-3px_0_rgba(0,0,0,0.2),0_4px_15px_rgba(255,255,255,0.1)] hover:bg-white hover:-translate-y-0.5 transition-all active:translate-y-0.5 active:shadow-[inset_0_1px_0_rgba(0,0,0,0.2)]"
            >
              Start Drawing
            </Link>
          </div>
        </div>
      </main>
    </PhysicalSlateWrapper>
  );
}
