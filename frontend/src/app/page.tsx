"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoginModal } from "@/components/LoginModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col font-sans transition-colors duration-500">
      {/* Dynamic Background Elements - Soft Pastels */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-200/40 dark:bg-rose-900/10 blur-[120px] -z-10 transition-colors duration-500" />
      <div className="absolute top-[30%] right-[-10%] w-[40%] h-[60%] rounded-full bg-blue-200/40 dark:bg-sky-900/10 blur-[140px] -z-10 transition-colors duration-500" />
      <div className="absolute bottom-[-20%] left-[10%] w-[40%] h-[50%] rounded-full bg-emerald-200/30 dark:bg-emerald-900/10 blur-[120px] -z-10 transition-colors duration-500" />

      {/* Header */}
      <header className="fixed top-0 w-full z-40 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Minimalist Logo */}
          <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-200 flex items-center justify-center text-white dark:text-slate-900 font-bold shadow-md">
            S
          </div>
          <span className="text-2xl font-semibold text-slate-800 dark:text-slate-200 tracking-tight">Slate</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 font-medium text-sm rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md hover:bg-white/80 dark:hover:bg-white/20 transition-all text-slate-700 dark:text-slate-200"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center mt-24 z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-md shadow-sm mb-2 text-slate-600 dark:text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold uppercase tracking-wider">A clean visual workspace</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-800 dark:text-slate-100 drop-shadow-sm">
            Think clearly. <br className="hidden md:block" />
            <span className="text-slate-500 dark:text-slate-400 font-light">
              Create together.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">
            A minimalist, real-time whiteboarding experience. Designed like a fresh slate, 
            giving your ideas the calm, uncluttered space they deserve.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 font-medium shadow-lg hover:bg-slate-700 dark:hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Open a new Slate
            </button>
            <button
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-md text-slate-700 dark:text-slate-300 font-medium hover:bg-white/80 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              Explore features
            </button>
          </div>
        </div>

        {/* Mockup Canvas Preview */}
        <div className="mt-20 w-full max-w-6xl aspect-[16/10] rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-[#1a1f2e]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden flex items-center justify-center group">
          {/* Decorative minimalist dots grid for whiteboard feel */}
          <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentcolor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          
          <div className="text-slate-400 dark:text-slate-500 font-medium text-lg flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            Ready to draw...
          </div>
        </div>
      </main>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

