"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PhysicalSlateWrapper } from "@/components/PhysicalSlateWrapper";

import { useParams } from "next/navigation";
import { Whiteboard } from "@/components/Whiteboard";
import { downloadSlateFile } from "@/utils/serialization";
import { useStatus } from "@/liveblocks.config";
import { CollaborativeRoom } from "@/components/Whiteboard/CollaborativeRoom";
import { useWhiteboard } from "@/hooks/useWhiteboard";

export default function CanvasPage() {
  const params = useParams();
  const id = params.id as string;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <CollaborativeRoom roomId={id}>
      <CanvasPageContent 
        id={id} 
        handleLogout={handleLogout} 
      />
    </CollaborativeRoom>
  );
}

function CanvasPageContent({ 
  id, 
  handleLogout 
}: { 
  id: string, 
  handleLogout: () => void 
}) {
  const { 
    slateMetadata, 
    setSlateName, 
    canWrite 
  } = useWhiteboard();
  const status = useStatus();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMode, setShareMode] = useState<"read" | "write">("read");

  useEffect(() => {
    // Collect shared slates if not already in "my-slates"
    const mySlates = JSON.parse(localStorage.getItem("my-slates") || "[]");
    const isOwned = mySlates.some((s: any) => s.id === id);
    
    if (!isOwned) {
      const sharedSlates = JSON.parse(localStorage.getItem("shared-slates") || "[]");
      const alreadyTracked = sharedSlates.some((s: any) => s.id === id);
      
      if (!alreadyTracked && slateMetadata.name !== "Untitled Slate") {
        const newShared = [
          {
            id,
            name: slateMetadata.name,
            lastModified: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-').toUpperCase(),
            previewColor: "#22d3ee"
          },
          ...sharedSlates
        ];
        localStorage.setItem("shared-slates", JSON.stringify(newShared));
      } else if (alreadyTracked) {
        // Update name if it changed
        const updated = sharedSlates.map((s: any) => 
          s.id === id ? { ...s, name: slateMetadata.name } : s
        );
        localStorage.setItem("shared-slates", JSON.stringify(updated));
      }
    }
  }, [id, slateMetadata.name]);

  const copyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("mode", shareMode);
    navigator.clipboard.writeText(url.toString());
    alert(`Copied ${shareMode} link to clipboard!`);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <PhysicalSlateWrapper showFooter={false} noBorder={true}>
          {/* Transparent Header */}
          <header className="absolute top-0 left-0 w-full z-40 px-6 py-4 flex items-center justify-between pointer-events-none transition-colors">
            <div className="flex items-center gap-6 pointer-events-auto">
              <Link href="/canvas" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded shadow-inner bg-slate-100/50 dark:bg-[#3d4554]/50 backdrop-blur-sm border border-black/5 dark:border-white/10 flex items-center justify-center text-slate-800 dark:text-[#e2e8f0] group-hover:scale-105 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>

              <div className="flex flex-col">
                <input 
                  value={slateMetadata.name}
                  onChange={(e) => setSlateName(e.target.value)}
                  disabled={!canWrite}
                  className="bg-transparent border-none outline-none text-xl font-bold text-slate-800/80 dark:text-[#f8fafc]/80 placeholder:opacity-30 focus:text-slate-900 dark:focus:text-white transition-all w-48 sm:w-64 disabled:opacity-50"
                  placeholder="Untitled Slate"
                />
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-slate-500 -mt-1 ml-0.5">
                  SlateCanvas / {id.slice(0, 8)} {!canWrite && "• READ ONLY"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 pointer-events-auto">
              <div className={`hidden sm:flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border transition-all duration-500 backdrop-blur-sm ${
                status === "connected" ? "border-green-500/30" : 
                status === "connecting" || status === "reconnecting" ? "border-amber-500/30" : "border-red-500/30"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  status === "connected" ? "bg-green-500 animate-pulse" : 
                  status === "connecting" || status === "reconnecting" ? "bg-amber-500 animate-bounce" : "bg-red-500"
                }`}></div>
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 dark:text-slate-400">
                  {status === "connected" ? "Sync Active" : 
                   status === "connecting" || status === "reconnecting" ? "Connecting..." : "Sync Offline"}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 transition-all active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16 6 12 2 8 6"></polyline>
                    <line x1="12" y1="2" x2="12" y2="15"></line>
                  </svg>
                  <span className="text-[10px] uppercase tracking-widest font-black">Share</span>
                </button>

                <button 
                  onClick={() => {
                    const elements = (window as any).whiteboardElements || [];
                    downloadSlateFile(id, slateMetadata.name, elements);
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
                <button 
                  onClick={handleLogout}
                  className="text-[10px] uppercase tracking-widest font-black text-amber-600 dark:text-[#ff8a65] hover:opacity-70 transition-opacity"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          {/* Share Modal */}
          {showShareModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white dark:bg-[#1e232b] w-full max-w-sm rounded-3xl shadow-2xl border border-black/5 dark:border-white/10 p-8 transform animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Share Slate</h2>
                  <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl">
                    <button 
                      onClick={() => setShareMode("read")}
                      className={`flex-1 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${shareMode === "read" ? "bg-white dark:bg-[#2d333d] shadow-sm text-slate-800 dark:text-white" : "text-slate-400"}`}
                    >
                      Can View
                    </button>
                    <button 
                      onClick={() => setShareMode("write")}
                      className={`flex-1 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${shareMode === "write" ? "bg-white dark:bg-[#2d333d] shadow-sm text-slate-800 dark:text-white" : "text-slate-400"}`}
                    >
                      Can Edit
                    </button>
                  </div>

                  <button 
                    onClick={copyShareLink}
                    className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-[10px] uppercase font-black tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    Copy Share Link
                  </button>
                  
                  <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                    Link expires with room session
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Full Screen Whiteboard */}
          <main className="flex-1 relative overflow-hidden">
            <Whiteboard roomId={id} />
          </main>
        </PhysicalSlateWrapper>
      </div>
  );
}
