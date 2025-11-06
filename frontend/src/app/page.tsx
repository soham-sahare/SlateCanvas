"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen h-screen w-full flex flex-col transition-colors duration-500 bg-[#f0ede6] dark:bg-[#121212] font-sans selection:bg-[#4dd0e1]/30">
      
      {/* 
        The Physical Slate 
        Outer div represents the wooden frame 
      */}
      <div className="relative w-full h-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col transition-all duration-300 ring-1 ring-black/5">
        
        {/* Wooden Texture Frame (Outer layer) */}
        <div className="absolute inset-0 bg-[#8b5a2b] dark:bg-[#3a2511]">
          {/* Wood grain overlay (CSS radial + linear gradients) */}
          <div className="absolute inset-0 opacity-40 mix-blend-multiply" 
            style={{ 
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px), linear-gradient(0deg, rgba(0,0,0,0.2), transparent)' 
            }} 
          />
        </div>

        {/* 
          The Slate Surface (Inner layer) 
          Sits inside the frame, giving a thick border effect
        */}
        <div className="absolute inset-[12px] md:inset-[18px] lg:inset-[24px] rounded-[8px] bg-[#2A313C] dark:bg-[#1e232b] shadow-[inset_0_4px_15px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col">
          
          {/* Chalk dust overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
              backgroundRepeat: 'repeat'
            }} 
          />
          
          {/* Subtle eraser marks overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)' }}
          />

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
          <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 pt-10">
            <div className="max-w-3xl mx-auto space-y-10">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[#4dd0e1] tracking-wider uppercase text-xs font-semibold shadow-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#4dd0e1]"></span>
                <span>The Collaborative Whiteboard</span>
              </div>
              
              {/* Hand-drawn aesthetic typography (using standard fonts but pastel colors) */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-[#f8fafc]" style={{textShadow: '0 2px 10px rgba(255,255,255,0.1)'}}>
                Ready the <span className="text-[#ff8a65] italic font-serif">Slate.</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-xl md:text-2xl text-[#cbd5e1] leading-relaxed font-light">
                Write, draw, and build together on an infinite canvas that feels just like the real thing.
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

            {/* Faux Chalk Elements */}
            {mounted && (
              <div className="absolute bottom-24 w-full max-w-4xl mx-auto px-8 flex justify-between items-end opacity-40 pointer-events-none">
                {/* A squiggly line */}
                <svg className="w-24 h-12 text-[#ffb74d]" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 25 Q 15 5 25 25 T 45 25 T 65 25 T 85 25 T 95 25" />
                </svg>
                {/* An arrow */}
                <svg className="w-16 h-16 text-[#4dd0e1]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M80 20 C 80 50 50 80 20 80 M 20 80 L 40 80 M 20 80 L 20 60" />
                </svg>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="relative z-40 w-full px-6 py-6 flex items-center justify-between text-sm text-[#cbd5e1]/80 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span>Made with</span>
              <span className="text-[#ff8a65]">❤</span>
              <span>by</span>
              <Link href="https://sohamsahare.in/" target="_blank" rel="noopener noreferrer" className="text-[#e2e8f0] hover:text-[#4dd0e1] font-medium transition-colors">
                sohamsahare
              </Link>
            </div>

            <Link href="https://github.com/soham-sahare/SlateCanvas" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#cbd5e1]/80 hover:text-white transition-colors" aria-label="GitHub Repository">
              <span className="hidden sm:inline">GitHub</span>
              <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
              </svg>
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}

