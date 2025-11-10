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

  const deleteElement = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
      selectedIds: prev.selectedIds.filter((sid) => sid !== id),
    }));
  }, []);

  const [dragStartPoint, setDragStartPoint] = useState<Point | null>(null);

  const setTool = useCallback((tool: Tool) => {
    setState((prev) => ({ ...prev, currentTool: tool }));
  }, []);

  const moveElements = useCallback((deltaX: number, deltaY: number) => {
    setState((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => {
        if (prev.selectedIds.includes(el.id)) {
          if (el.type === "draw") {
            const drawEl = el as any;
            return {
              ...drawEl,
              points: drawEl.points.map((p: Point) => ({
                x: p.x + deltaX,
                y: p.y + deltaY,
              })),
            };
          }
          return { ...el, x: el.x + deltaX, y: el.y + deltaY };
        }
        return el;
      }),
    }));
  }, []);

  const getElementAtPosition = useCallback((point: Point): WhiteboardElement | null => {
    // Search backwards (top elements first)
    for (let i = state.elements.length - 1; i >= 0; i--) {
      const el = state.elements[i];
      
      if (el.type === "draw") {
        const drawEl = el as any;
        // Simple bounding box check for draw elements for now
        const minX = Math.min(...drawEl.points.map((p: Point) => p.x));
        const maxX = Math.max(...drawEl.points.map((p: Point) => p.x));
        const minY = Math.min(...drawEl.points.map((p: Point) => p.y));
        const maxY = Math.max(...drawEl.points.map((p: Point) => p.y));
        if (point.x >= minX - 10 && point.x <= maxX + 10 && point.y >= minY - 10 && point.y <= maxY + 10) {
          return el;
        }
        continue;
      }

      const x = Math.min(el.x, el.x + el.width);
      const y = Math.min(el.y, el.y + el.height);
      const w = Math.abs(el.width);
      const h = Math.abs(el.height);

      if (point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h) {
        return el;
      }
    }
    return null;
  }, [state.elements]);
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
    deleteElement,
    moveElements,
    getElementAtPosition,
    getCanvasCoordinates,
    clearSelection,
    selectElement,
    dragStartPoint,
    setDragStartPoint,
  };
};
