"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";
import { ThemeToggle } from "@/components/ThemeToggle";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

interface SlateInstance {
  id: string;
  name: string;
  lastModified: string;
  previewColor: string;
}

const formatDate = (date: Date) => {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const d = date.getDate();
  const m = months[date.getMonth()];
  const y = date.getFullYear().toString().slice(-2);
  return `${d < 10 ? '0' + d : d}-${m}-${y}`;
};

export default function DashboardPage() {
  const router = useRouter();
  const [slates, setSlates] = useState<SlateInstance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock loading saved slates (Phase 5 will involve real persistence)
    const saved = localStorage.getItem("my-slates");
    if (saved) {
      setSlates(JSON.parse(saved));
    } else {
      // Create a default first slate
      const initial: SlateInstance[] = [
        { 
          id: "welcome-slate", 
          name: "Welcome to SlateCanvas", 
          lastModified: formatDate(new Date()),
          previewColor: "#ff8a65" 
        }
      ];
      setSlates(initial);
      localStorage.setItem("my-slates", JSON.stringify(initial));
    }
    setLoading(false);
  }, []);

  const createNewSlate = () => {
    const id = uuidv4();
    const newSlate: SlateInstance = {
      id,
      name: `Untitled Slate`,
      lastModified: formatDate(new Date()),
      previewColor: "#3b82f6"
    };
    const updated = [newSlate, ...slates];
    setSlates(updated);
    localStorage.setItem("my-slates", JSON.stringify(updated));
    router.push(`/canvas/${id}`);
  };

  const deleteSlate = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this slate?")) {
      const updated = slates.filter(s => s.id !== id);
      setSlates(updated);
      localStorage.setItem("my-slates", JSON.stringify(updated));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <PhysicalSlateWrapper showFooter={true}>
        {/* Header */}
        <header className="relative w-full z-40 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded shadow-inner bg-slate-100 dark:bg-[#3d4554] border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-[#e2e8f0]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12L13 8L17 12" stroke="#ff8a65" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-[#f8fafc] tracking-tight transition-colors">My Slates</h1>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button 
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[10px] uppercase font-black tracking-widest transition-all shadow-lg active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="flex-1 overflow-y-auto p-8 sm:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              
              {/* "New Slate" Card */}
              <button 
                onClick={createNewSlate}
                className="group relative h-48 rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-4 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/5 dark:hover:bg-orange-500/5 transition-all active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  New Slate
                </span>
              </button>

              {/* Slate List */}
              {slates.map((slate) => (
                <Link 
                  key={slate.id}
                  href={`/canvas/${slate.id}`}
                  className="group relative h-48 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slate.previewColor }} />
                    <button 
                      onClick={(e) => deleteSlate(e, slate.id)}
                      className="p-2 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all text-slate-400"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                      {slate.name}
                    </h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                      Last Edit: {slate.lastModified}
                    </p>
                  </div>

                  {/* Faux drawing preview lines */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/3 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                    <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 20 Q 15 5 25 20 T 45 20 T 65 20 T 85 20" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </PhysicalSlateWrapper>
    </div>
  );
}
