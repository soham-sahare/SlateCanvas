"use client";

import React from "react";
import { WhiteboardElement } from "@/types/whiteboard";
import { 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Layers, 
  Trash2,
  Check
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PropertiesPanelProps {
  selectedElements: WhiteboardElement[];
  onUpdate: (id: string, updates: Partial<WhiteboardElement>) => void;
  onDelete: (id: string) => void;
}

const COLORS = [
  { name: "Slate", value: "#3d4554" },
  { name: "Orange", value: "#ff8a65" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Purple", value: "#8b5cf6" },
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElements,
  onUpdate,
  onDelete,
}) => {
  if (selectedElements.length === 0) return null;

  const element = selectedElements[0]; // For now, only handle single selection for props

  return (
    <div className="absolute left-6 top-1/2 translate-y-[60px] z-30 flex flex-col gap-6 p-4 rounded-2xl bg-white/90 dark:bg-[#1e232b]/80 backdrop-blur-md border border-slate-200 dark:border-white/5 shadow-2xl w-60 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="space-y-4">
        {/* Stroke Color */}
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            Stroke Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onUpdate(element.id, { strokeColor: color.value })}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                  element.strokeColor === color.value ? "border-slate-400 dark:border-white/40" : "border-transparent"
                )}
                style={{ backgroundColor: color.value }}
              >
                {element.strokeColor === color.value && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            Background
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onUpdate(element.id, { backgroundColor: "transparent" })}
              className={cn(
                "w-6 h-6 rounded-full border border-slate-200 dark:border-white/10 bg-transparent relative overflow-hidden flex items-center justify-center",
                element.backgroundColor === "transparent" && "ring-2 ring-slate-400 dark:ring-white/40"
              )}
            >
              <div className="absolute w-[140%] h-[1px] bg-red-500 rotate-45" />
            </button>
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onUpdate(element.id, { backgroundColor: color.value })}
                className={cn(
                  "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                  element.backgroundColor === color.value ? "border-slate-400 dark:border-white/40" : "border-transparent"
                )}
                style={{ backgroundColor: color.value }}
              >
                {element.backgroundColor === color.value && <Check className="w-3 h-3 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Stroke Width */}
        <div className="space-y-2">
          <label className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            Stroke Width
          </label>
          <div className="flex gap-2">
            {[1, 2, 4, 8].map((width) => (
              <button
                key={width}
                onClick={() => onUpdate(element.id, { strokeWidth: width })}
                className={cn(
                  "flex-1 h-8 rounded-lg border flex items-center justify-center transition-colors",
                  element.strokeWidth === width 
                    ? "bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/20" 
                    : "bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <div 
                  className="bg-slate-800 dark:bg-[#e2e8f0] rounded-full" 
                  style={{ height: width, width: '100%', margin: '0 4px' }} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Delete */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/5">
          <button 
            onClick={() => onDelete(element.id)}
            className="w-full h-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[10px] font-black tracking-widest uppercase">Delete Element</span>
          </button>
        </div>
      </div>
    </div>
  );
};
