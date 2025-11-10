import { useState, useCallback, useRef } from "react";
import { WhiteboardElement, Tool, Point, WhiteboardState } from "@/types/whiteboard";
import { v4 as uuidv4 } from "uuid";

export const useWhiteboard = () => {
  const [state, setState] = useState<WhiteboardState>({
    elements: [],
    selectedIds: [],
    currentTool: "select",
    isDragging: false,
    isDrawing: false,
    zoom: 1,
    offset: { x: 0, y: 0 },
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addElement = useCallback((element: WhiteboardElement) => {
    setState((prev) => ({
      ...prev,
      elements: [...prev.elements, element],
    }));
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<WhiteboardElement>) => {
    setState((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    }));
  }, []);

  const setTool = useCallback((tool: Tool) => {
    setState((prev) => ({ ...prev, currentTool: tool }));
  }, []);

  const getCanvasCoordinates = useCallback((clientX: number, clientY: number): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - state.offset.x) / state.zoom,
      y: (clientY - rect.top - state.offset.y) / state.zoom,
    };
  }, [state.zoom, state.offset]);

  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedIds: [] }));
  }, []);

  const selectElement = useCallback((id: string, shiftKey: boolean = false) => {
    setState((prev) => {
      if (shiftKey) {
        const isSelected = prev.selectedIds.includes(id);
        return {
          ...prev,
          selectedIds: isSelected 
            ? prev.selectedIds.filter(sid => sid !== id)
            : [...prev.selectedIds, id]
        };
      }
      return { ...prev, selectedIds: [id] };
    });
  }, []);

  return {
    state,
    setState,
    canvasRef,
    setTool,
    addElement,
    updateElement,
    getCanvasCoordinates,
    clearSelection,
    selectElement,
  };
};
