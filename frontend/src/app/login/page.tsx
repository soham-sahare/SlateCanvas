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
      <header className="relative w-full z-40 px-6 py-5 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded shadow-inner bg-[#3d4554] border border-white/10 flex items-center justify-center text-[#e2e8f0] group-hover:scale-105 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L13 8L17 12" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 16H17" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-semibold text-[#e2e8f0] tracking-tight text-shadow-sm">SlateCanvas</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 w-full max-w-md mx-auto">
        <div className="relative w-full p-8 sm:p-10 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_40px_-10px_rgba(0,0,0,0.5)] bg-[#1e232b] border border-white/5 transition-all overflow-hidden">
          
          <div className="relative z-10 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-[#f8fafc]" style={{textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>Welcome back</h1>
              <p className="text-sm text-[#cbd5e1]/80">Log in to your SlateCanvas account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[#e2e8f0]">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4dd0e1]/50 focus:border-transparent transition-all text-white placeholder-white/30"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#e2e8f0]">Password</label>
                  <a href="#" className="text-xs font-semibold text-[#4dd0e1] hover:underline">Forgot password?</a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4dd0e1]/50 focus:border-transparent transition-all text-white placeholder-white/30"
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#e2e8f0] text-[#1e293b] font-bold shadow-[inset_0_-3px_0_rgba(0,0,0,0.2)] hover:bg-white hover:-translate-y-0.5 transition-all active:translate-y-0.5 active:shadow-[inset_0_1px_0_rgba(0,0,0,0.2)]"
              >
                Log In
              </button>
            </form>

            <p className="text-sm text-center text-[#cbd5e1]/80 pt-2">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-[#4dd0e1] hover:underline underline-offset-2">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </PhysicalSlateWrapper>
  );
}
