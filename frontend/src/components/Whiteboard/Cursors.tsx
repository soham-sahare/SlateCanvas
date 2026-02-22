"use client";

import React from "react";
import { useOthers } from "../../liveblocks.config";

export const Cursors = () => {
  const others = useOthers();

  return (
    <>
      {others.map(({ connectionId, presence }) => {
        if (!presence.cursor) return null;

        return (
          <Cursor
            key={connectionId}
            color={presence.color || getUserColor(connectionId)}
            name={presence.name || "Guest"}
            x={presence.cursor.x}
            y={presence.cursor.y}
          />
        );
      })}
    </>
  );
};

interface CursorProps {
  color: string;
  name: string;
  x: number;
  y: number;
}

const Cursor = ({ color, name, x, y }: CursorProps) => {
  return (
    <div
      className="absolute top-0 left-0 z-50 pointer-events-none transition-transform duration-75"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.375L5.60335 12.3371L5.55294 12.375V11.375V12.375ZM5.65376 12.375C5.65376 12.375 5.65376 12.375 5.65376 12.375ZM5.65376 12.375L12.5975 17.5828L10.9039 19.3328L10.0503 20.2114L11.2325 21.098L16.0336 24.698L11.2325 21.098V21.0981L16.0336 24.6989L18.176 26.299L19.3453 27.1755L20.2017 25.9961L22.6265 22.6511L23.4756 21.48L22.2829 20.6277L20.1405 19.1027L15.3394 15.5027L20.1405 19.1027L20.1405 19.1027L22.2829 20.6277L20.1405 19.1027L15.3394 15.5027H29.155L5.65376 12.375Z"
          fill={color}
        />
      </svg>
      <div 
        className="ml-4 mt-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest text-white shadow-xl whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </div>
  );
};

// Helper to get a stable color based on connection ID
const getUserColor = (connectionId: number) => {
  const colors = [
    "#ff8a65", // Slate Orange
    "#3b82f6", // Blue
    "#10b981", // Green
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#f59e0b", // Amber
    "#06b6d4", // Cyan
  ];
  return colors[connectionId % colors.length];
};
