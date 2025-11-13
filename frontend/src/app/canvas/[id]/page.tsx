"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";

import { useParams } from "next/navigation";
import { Whiteboard } from "@/components/Whiteboard";
import { downloadSlateFile } from "@/utils/serialization";

export default function CanvasPage() {
  const params = useParams();
  const id = params.id as string;
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [slateName, setSlateName] = useState("Untitled Slate");

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setUserEmail("sohamsahare"); 

    // Load slate metadata
    const saved = localStorage.getItem("my-slates");
    if (saved) {
      const slates = JSON.parse(saved);
      const current = slates.find((s: any) => s.id === id);
      if (current) setSlateName(current.name);
    }
  }, [id]);

  useEffect(() => {
    (window as any).currentWhiteboardRoomId = id;
  }, [id]);

  const updateSlateName = (newName: string) => {
    setSlateName(newName);
    const saved = localStorage.getItem("my-slates");
    if (saved) {
      const slates = JSON.parse(saved);
      const updated = slates.map((s: any) => 
        s.id === id ? { ...s, name: newName } : s
      );
      localStorage.setItem("my-slates", JSON.stringify(updated));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <PhysicalSlateWrapper showFooter={false} noBorder={true}>
        {/* Transparent Header */}
        <header className="absolute top-0 left-0 w-full z-40 px-6 py-4 flex items-center justify-between pointer-events-none transition-colors">
          <div className="flex items-center gap-6 pointer-events-auto">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded shadow-inner bg-slate-100/50 dark:bg-[#3d4554]/50 backdrop-blur-sm border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-[#e2e8f0] group-hover:scale-105 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>

            <div className="flex flex-col">
              <input 
                value={slateName}
                onChange={(e) => updateSlateName(e.target.value)}
                className="bg-transparent border-none outline-none text-xl font-bold text-slate-800/80 dark:text-[#f8fafc]/80 placeholder:opacity-30 focus:text-slate-900 dark:focus:text-white transition-all w-48 sm:w-64"
                placeholder="Untitled Slate"
              />
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 -mt-1 ml-0.5">SlateCanvas / {id.slice(0, 8)}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 pointer-events-auto">
            <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 dark:text-slate-400">Collaboration Ready</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  const elements = (window as any).whiteboardElements || [];
                  downloadSlateFile(id, "My Slate", elements);
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-[#4dd0e1] border border-cyan-500/20 transition-all active:scale-95"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span className="text-[10px] uppercase tracking-widest font-black">Export</span>
              </button>
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

        {/* Full Screen Whiteboard */}
        <main className="flex-1 relative overflow-hidden">
          <Whiteboard roomId={id} />
        </main>
      </PhysicalSlateWrapper>
    </div>
  );
}
