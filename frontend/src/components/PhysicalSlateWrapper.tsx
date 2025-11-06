"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PhysicalSlateWrapperProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export function PhysicalSlateWrapper({ children, showFooter = false }: PhysicalSlateWrapperProps) {
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
          {/* Wood grain overlay */}
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

          {children}

          {/* Faux Chalk Elements - Refined per screenshots */}
          {mounted && (
            <div className="absolute bottom-16 w-full px-12 flex justify-between items-end opacity-20 pointer-events-none z-0">
              {/* Left Squiggly line */}
              <div className="flex gap-20 items-end">
                <svg className="w-20 h-10 text-[#ffb74d]" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 25 Q 15 5 25 25 T 45 25 T 65 25 T 85 25 T 95 25" />
                </svg>

                {/* Triple wavy lines */}
                <svg className="w-24 h-12 text-[#e2e8f0]" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 15 Q 15 5 25 15 T 45 15 T 65 15 T 85 15" />
                  <path d="M5 25 Q 15 15 25 25 T 45 25 T 65 25 T 85 25" />
                  <path d="M5 35 Q 15 25 25 35 T 45 35 T 65 35 T 85 35" />
                </svg>
              </div>

              {/* Right Arrow */}
              <svg className="w-14 h-14 text-[#4dd0e1] -rotate-12 translate-y-4" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M80 20 C 80 50 50 80 20 80 M 20 80 L 40 80 M 20 80 L 20 60" />
              </svg>
            </div>
          )}

          {/* Footer */}
          {showFooter && (
            <footer className="relative z-40 w-full px-8 py-6 flex items-center justify-between text-xs tracking-wider text-[#cbd5e1]/50 mt-auto font-medium">
              <div className="flex items-center gap-1.5 transition-all cursor-default">
                <span>Made with</span>
                <span className="text-[#ff8a65] animate-pulse">❤</span>
                <span>by</span>
                <Link 
                  href="https://sohamsahare.in/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#ff8a65] hover:text-[#4dd0e1] transition-colors font-bold"
                >
                  sohamsahare
                </Link>
              </div>

              <Link 
                href="https://github.com/soham-sahare/SlateCanvas" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-[#cbd5e1]/60 hover:text-[#4dd0e1] transition-all group" 
                aria-label="GitHub Repository"
              >
                <span className="group-hover:text-[#4dd0e1]">GitHub</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"></path>
                </svg>
              </Link>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
