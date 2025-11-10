"use client";

import React from "react";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";
import { useWhiteboard } from "@/hooks/useWhiteboard";

export const Whiteboard: React.FC = () => {
  const { 
    state, 
    setTool, 
    addElement, 
    setState,
    selectElement 
  } = useWhiteboard();

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent">
      <Toolbar 
        currentTool={state.currentTool} 
        onToolSelect={setTool} 
      />
      
      <Canvas
        elements={state.elements}
        currentTool={state.currentTool}
        zoom={state.zoom}
        offset={state.offset}
        selectedIds={state.selectedIds}
        onElementsChange={(elements) => setState(prev => ({ ...prev, elements }))}
        onSelectionChange={(selectedIds) => setState(prev => ({ ...prev, selectedIds }))}
        onOffsetChange={(offset) => setState(prev => ({ ...prev, offset }))}
      />

      {/* Zoom / Info Indicator */}
      <div className="fixed bottom-6 left-6 z-40 bg-white/80 dark:bg-[#1e232b]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm flex items-center gap-4">
        <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          Zoom: {Math.round(state.zoom * 100)}%
        </span>
        <div className="w-[1px] h-3 bg-slate-200 dark:bg-white/10" />
        <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          Elements: {state.elements.length}
        </span>
      </div>

      {/* Help Tip */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <p className="text-[10px] font-black tracking-tighter text-slate-300 dark:text-slate-600 uppercase">
          Hold Shift for multiple selection • Space to Pan
        </p>
      </div>
    </div>
  );
};
