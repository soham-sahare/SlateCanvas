import { useEffect } from "react";
import { Tool } from "@/types/whiteboard";

interface ShortcutProps {
  onSetTool: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onExport: () => void;
  canWrite: boolean;
}

export const useShortcuts = ({
  onSetTool,
  onUndo,
  onRedo,
  onDelete,
  onSelectAll,
  onExport,
  canWrite
}: ShortcutProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMod = e.metaKey || e.ctrlKey;

      // Undo/Redo
      if (isMod && e.key === "z") {
        if (e.shiftKey) {
          onRedo();
        } else {
          onUndo();
        }
        e.preventDefault();
        return;
      }

      if (isMod && e.key === "y") {
        onRedo();
        e.preventDefault();
        return;
      }

      // Tools
      if (e.key === "v") onSetTool("select");
      if (e.key === "r") onSetTool("rect");
      if (e.key === "e") onSetTool("ellipse");
      if (e.key === "d") onSetTool("diamond");
      if (e.key === "l") onSetTool("line");
      if (e.key === "a") onSetTool("arrow");
      if (e.key === "p" || e.key === "f") onSetTool("draw");
      if (e.key === "t") onSetTool("text");
      if (e.key === "x") onSetTool("eraser");

      // Actions
      if (e.key === "Delete" || e.key === "Backspace") {
        if (canWrite) {
          onDelete();
        }
      }

      if (isMod && e.key === "a") {
        onSelectAll();
        e.preventDefault();
      }

      if (isMod && e.key === "s") {
        onExport();
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSetTool, onUndo, onRedo, onDelete, onSelectAll, onExport, canWrite]);
};
