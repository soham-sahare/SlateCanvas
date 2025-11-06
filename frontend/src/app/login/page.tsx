"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    console.log("Login with:", email, password);
  };

  return (
    <PhysicalSlateWrapper>
      {/* Header */}
      <header className="relative w-full z-40 px-10 py-6 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded shadow-inner bg-[#3d4554] border border-white/10 flex items-center justify-center text-[#e2e8f0]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L13 8L17 12" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16H17" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-2xl font-semibold text-[#e2e8f0] tracking-tight" style={{textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>SlateCanvas</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 w-full max-w-md mx-auto">
        <div className="relative w-full p-8 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] bg-[#1e232b]/80 backdrop-blur-md border border-white/5 transition-all overflow-hidden flex flex-col items-center">
          
          <div className="relative z-10 space-y-10 w-full">
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-[#f8fafc]" style={{textShadow: '0 2px 4px rgba(0,0,0,0.4)'}}>Welcome back</h1>
              <p className="text-xs text-[#cbd5e1]/50 tracking-wider">Log in to your SlateCanvas account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#cbd5e1]/40 ml-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sohamsahare"
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#f0f4f8] border-none focus:outline-none focus:ring-2 focus:ring-[#4dd0e1]/50 transition-all text-[#1e232b] placeholder-[#1e232b]/30 font-medium"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#cbd5e1]/40">Password</label>
                  <a href="#" className="text-[10px] font-bold text-[#4dd0e1] hover:underline uppercase tracking-wider">Forgot password?</a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-5 py-3.5 rounded-2xl bg-[#f0f4f8] border-none focus:outline-none focus:ring-2 focus:ring-[#4dd0e1]/50 transition-all text-[#1e232b] placeholder-[#1e232b]/30 font-medium"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-4 px-4 rounded-2xl bg-[#e2e8f0] text-[#1e293b] font-black text-xs uppercase tracking-widest shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)] hover:bg-white hover:-translate-y-0.5 transition-all active:translate-y-0.5 active:shadow-none"
              >
                Log In
              </button>
            </form>

            <p className="text-xs text-center text-[#cbd5e1]/40 font-medium tracking-wide pt-2">
              Don't have an account?{" "}
              <Link href="/signup" className="font-bold text-[#4dd0e1] hover:underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </PhysicalSlateWrapper>
  );
}
