"use client";

import React, { ReactNode } from "react";
import { RoomProvider } from "../../liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";

interface CollaborativeRoomProps {
  children: ReactNode;
  roomId: string;
}

export const CollaborativeRoom: React.FC<CollaborativeRoomProps> = ({ children, roomId }) => {

  return (
    <RoomProvider 
      id={roomId} 
      initialPresence={{ cursor: null, selection: [] }}
    >
      <ClientSideSuspense fallback={<LoadingWhiteboard />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

const LoadingWhiteboard = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-[#1e232b]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
        Initializing Collaborative Slate...
      </p>
    </div>
  </div>
);
