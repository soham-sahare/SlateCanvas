"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoginModal } from "@/components/LoginModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Dynamic Background Elements (Glassmorphism Environment) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/30 dark:bg-blue-600/20 blur-[100px] -z-10" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] rounded-full bg-purple-400/20 dark:bg-purple-800/20 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-teal-300/20 dark:bg-teal-700/20 blur-[100px] -z-10" />

      {/* Header */}
      <header className="fixed top-0 w-full z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Faux Logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500.to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
            S
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Slate</span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 font-medium text-sm rounded-xl bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/10 shadow-sm backdrop-blur-md hover:bg-white/60 dark:hover:bg-white/20 transition-all text-slate-800 dark:text-slate-200"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center mt-20 z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/10 backdrop-blur-md shadow-sm mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Phase 1: Glassmorphism Architecture</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
            Think, Draw, and <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
              Create Together.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Slate is a real-time collaborative whiteboard that feels magical.
            Designed with a stunning glassmorphism aesthetic to let your ideas shine through.
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] hover:bg-blue-500 transition-all"
            >
              Get Started for Free
            </button>
            <button
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-xl text-slate-800 dark:text-slate-200 font-semibold hover:bg-white/50 dark:hover:bg-white/10 transition-all shadow-sm"
            >
              View Documentation
            </button>
          </div>
        </div>

        {/* Mockup Canvas Preview */}
        <div className="mt-20 w-full max-w-6xl aspect-video rounded-3xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex items-center justify-center p-8">
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="text-slate-500/50 dark:text-slate-400/50 font-medium text-lg">
            Canvas Placeholder (Real-time features coming soon)
          </div>
        </div>
      </main>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
