"use client";

import { useState } from "react";

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 dark:bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm p-8 overflow-hidden rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-black/50 border border-white/40 dark:border-white/10 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 dark:text-gray-300"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white placeholder-gray-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white placeholder-gray-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 mt-2 rounded-xl font-medium text-white bg-blue-600/90 hover:bg-blue-600 border border-blue-500/50 shadow-lg shadow-blue-500/30 backdrop-blur-md transition-all"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
