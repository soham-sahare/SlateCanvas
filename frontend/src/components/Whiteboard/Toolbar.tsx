"use client";

import React from "react";
import { 
  Pointer, 
  Square, 
  Circle, 
  Diamond, 
  Minus, 
  ArrowUpRight, 
  Pencil, 
  Type, 
  Eraser 
} from "lucide-react";
import { Tool } from "@/types/whiteboard";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToolbarProps {
  currentTool: Tool;
  onToolSelect: (tool: Tool) => void;
}

const tools = [
  { id: "select", icon: Pointer, label: "Select (V)" },
  { id: "rect", icon: Square, label: "Rectangle (R)" },
  { id: "ellipse", icon: Circle, label: "Ellipse (O)" },
  { id: "diamond", icon: Diamond, label: "Diamond (D)" },
  { id: "line", icon: Minus, label: "Line (L)" },
  { id: "arrow", icon: ArrowUpRight, label: "Arrow (A)" },
  { id: "draw", icon: Pencil, label: "Draw (P)" },
  { id: "text", icon: Type, label: "Text (T)" },
  { id: "eraser", icon: Eraser, label: "Eraser (E)" },
] as const;

export const Toolbar: React.FC<ToolbarProps> = ({ currentTool, onToolSelect }) => {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 p-2 rounded-2xl bg-white/80 dark:bg-[#1e232b]/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all animate-in fade-in slide-in-from-left-4 duration-500">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = currentTool === tool.id;
        
        return (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id as Tool)}
            className={cn(
              "group relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
              isActive 
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-105" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:scale-105 active:scale-95"
            )}
            title={tool.label}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity translate-x-1 group-hover:translate-x-0">
              {tool.label}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-[4px] border-y-transparent border-r-[4px] border-r-slate-900/90 dark:border-r-slate-800/95"></div>
            </div>

            {/* Selection indicator DOT */}
            {isActive && (
              <div className="absolute -right-0.5 top-0.5 w-2 h-2 rounded-full bg-white border-2 border-amber-500 ring-2 ring-amber-500/20" />
            )}
          </button>
        );
      })}
    </div>
  );
};
