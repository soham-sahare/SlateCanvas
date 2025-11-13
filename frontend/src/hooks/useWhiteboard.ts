import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { WhiteboardElement, Tool, Point, WhiteboardState } from "@/types/whiteboard";
import { v4 as uuidv4 } from "uuid";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom } from "../liveblocks.config";

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

  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();

  // Initialize Y.Doc and Provider
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  const yElements = useMemo(() => {
    if (!doc) return null;
    return doc.getArray<WhiteboardElement>("elements");
  }, [doc]);

  // Sync Y.Array with React state
  useEffect(() => {
    if (!yElements) return;

    const handleChange = () => {
      setState((prev) => ({
        ...prev,
        elements: yElements.toArray(),
      }));
    };

    yElements.observe(handleChange);
    handleChange(); // Initial sync

    return () => {
      yElements.unobserve(handleChange);
    };
  }, [yElements]);

  useEffect(() => {
    (window as any).whiteboardElements = state.elements;
  }, [state.elements]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addElement = useCallback((element: WhiteboardElement) => {
    if (!yElements) return;
    yElements.push([element]);
  }, [yElements]);

  const updateElement = useCallback((id: string, updates: Partial<WhiteboardElement>) => {
    if (!yElements || !doc) return;
    
    doc.transact(() => {
      const index = yElements.toArray().findIndex(el => el.id === id);
      if (index !== -1) {
        const current = yElements.get(index);
        yElements.delete(index);
        yElements.insert(index, [{ ...current, ...updates }]);
      }
    });
  }, [yElements, doc]);

  const deleteElement = useCallback((id: string) => {
    if (!yElements || !doc) return;

    doc.transact(() => {
      const index = yElements.toArray().findIndex(el => el.id === id);
      if (index !== -1) {
        yElements.delete(index);
      }
      setState((prev) => ({
        ...prev,
        selectedIds: prev.selectedIds.filter((sid) => sid !== id),
      }));
    });
  }, [yElements, doc]);

  const [dragStartPoint, setDragStartPoint] = useState<Point | null>(null);

  const setTool = useCallback((tool: Tool) => {
    setState((prev) => ({ ...prev, currentTool: tool }));
  }, []);

  const moveElements = useCallback((deltaX: number, deltaY: number) => {
    if (!yElements || !doc) return;

    doc.transact(() => {
      const elements = yElements.toArray();
      state.selectedIds.forEach(id => {
        const index = elements.findIndex(el => el.id === id);
        if (index !== -1) {
          const el = elements[index];
          let updated;
          if (el.type === "draw") {
            const drawEl = el as any;
            updated = {
              ...drawEl,
              points: drawEl.points.map((p: Point) => ({
                x: p.x + deltaX,
                y: p.y + deltaY,
              })),
            };
          } else {
            updated = { ...el, x: el.x + deltaX, y: el.y + deltaY };
          }
          yElements.delete(index);
          yElements.insert(index, [updated]);
          // Refresh local array for next iteration in loop
          elements[index] = updated;
        }
      });
    });
  }, [yElements, doc, state.selectedIds]);

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
