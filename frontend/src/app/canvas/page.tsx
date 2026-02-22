"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";
import { ThemeToggle } from "@/components/ThemeToggle";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { importSlateFile } from "@/utils/serialization";
import { motion, AnimatePresence } from "framer-motion";

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

export default function CanvasDashboard() {
  const router = useRouter();
  const [slates, setSlates] = useState<SlateInstance[]>([]);
  const [sharedSlates, setSharedSlates] = useState<SlateInstance[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchSlates = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const [myRes, sharedRes] = await Promise.all([
          fetch(`${API_URL}/slates/`, {
            headers: { "Authorization": `Bearer ${token}` }
          }),
          fetch(`${API_URL}/slates/shared`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        if (myRes.ok) {
          const myData = await myRes.json();
          setSlates(myData.map((s: any) => ({
            id: s._id,
            name: s.name,
            lastModified: formatDate(new Date(s.last_modified)),
            previewColor: s.preview_color
          })));
        }

        if (sharedRes.ok) {
          const sharedData = await sharedRes.json();
          setSharedSlates(sharedData.map((s: any) => ({
            id: s._id,
            name: s.name,
            lastModified: formatDate(new Date(s.last_modified)), // Using last_modified as "joined" date for simplicity
            previewColor: s.preview_color
          })));
        }
      } catch (err) {
        console.error("Failed to fetch slates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlates();
  }, [API_URL]);

  const createNewSlate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/slates/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: "Untitled Slate",
          preview_color: ["#ff8a65", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#06b6d4"][Math.floor(Math.random() * 7)]
        }),
      });

      if (!response.ok) throw new Error("Failed to create slate");
      
      const data = await response.json();
      router.push(`/canvas/${data._id}`);
    } catch (err) {
      alert("Failed to create slate. Please try again.");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importSlateFile(file);
      // Create a new instance in dashboard based on imported data
      const newSlate: SlateInstance = {
        id: data.id || uuidv4(),
        name: data.name || "Imported Slate",
        lastModified: formatDate(new Date()),
        previewColor: "#c084fc" // Purple for imported
      };

      // Check if ID already exists to avoid duplicates
      const exists = slates.find(s => s.id === newSlate.id);
      const finalId = exists ? `${newSlate.id}-${Date.now()}` : newSlate.id;
      if (exists) newSlate.id = finalId;

      const updated = [newSlate, ...slates];
      setSlates(updated);
      localStorage.setItem("my-slates", JSON.stringify(updated));
      
      // Also save the elements to a temporary storage or just rely on the fact 
      // that Phase 7 will sync them to Liveblocks if we navigate?
      // Actually, Room state is in Yjs/Liveblocks. 
      // For now, we'll just redirect to the room. 
      // If the room is empty, the user might expect the imported elements to be there.
      // We should probably store the elements in a way that the canvas can pick them up.
      // For now, let's just alert success and push to canvas.
      
      router.push(`/canvas/${newSlate.id}?import=true`);
      // We'll handle the actual element injection in the CanvasPage/useWhiteboard if ?import=true
      (window as any).pendingImportElements = data.elements;
    } catch (err) {
      alert("Failed to import slate: Invalid file format.");
    }
  };

  const deleteSlate = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this slate?")) {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/slates/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          setSlates(slates.filter(s => s.id !== id));
        } else {
          const data = await response.json();
          alert(data.detail || "Failed to delete slate.");
        }
      } catch (err) {
        alert("An error occurred while deleting the slate.");
      }
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
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full z-40 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 transition-colors"
        >
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
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
              <span className="text-[10px] font-black uppercase tracking-widest">{slates.length + sharedSlates.length} Slates</span>
            </div>
            <ThemeToggle />
            <button 
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[10px] uppercase font-black tracking-widest transition-all shadow-lg active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </motion.header>

        {/* Dashboard Grid */}
        <main className="flex-1 overflow-y-auto p-8 sm:p-12">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {/* "New Slate" Card */}
              <motion.button 
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={createNewSlate}
                className="group relative h-48 rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-4 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/5 dark:hover:bg-orange-500/5 transition-all"
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
              </motion.button>

              {/* "Import Slate" Card */}
              <motion.label 
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative h-48 rounded-2xl border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-4 hover:border-cyan-400 dark:hover:border-cyan-500 hover:bg-cyan-50/5 dark:hover:bg-cyan-500/5 transition-all cursor-pointer"
              >
                <input 
                  type="file" 
                  accept=".slatecanvas" 
                  onChange={handleImport} 
                  className="hidden" 
                />
                <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Import Slate
                </span>
              </motion.label>

              {/* Slate List */}
              <AnimatePresence mode="popLayout">
                {slates.map((slate, index) => (
                  <motion.div
                    key={slate.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link 
                      href={`/canvas/${slate.id}`}
                      className="group relative h-48 w-full rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 p-6 flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all block"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slate.previewColor }} />
                        <motion.button 
                          whileHover={{ scale: 1.2, color: "#ef4444" }}
                          onClick={(e) => deleteSlate(e, slate.id)}
                          className="p-2 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-all text-slate-400"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </motion.button>
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Shared with Me Section */}
            {sharedSlates.length > 0 && (
              <div className="mt-16">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Shared with Me</h2>
                  <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {sharedSlates.map((slate) => (
                    <Link 
                      key={slate.id}
                      href={`/canvas/${slate.id}`}
                      className="group relative h-48 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 p-6 flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="px-2 py-0.5 rounded-md bg-cyan-500 text-[8px] font-black uppercase text-white tracking-widest">Shared</div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                          {slate.name}
                        </h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                          Joined: {slate.lastModified}
                        </p>
                      </div>

                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/3 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                        <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="30" cy="20" r="10" />
                          <circle cx="70" cy="20" r="10" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </PhysicalSlateWrapper>
    </div>
  );
}
