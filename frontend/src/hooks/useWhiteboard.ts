import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { WhiteboardElement, Tool, Point, WhiteboardState } from "@/types/whiteboard";
import { v4 as uuidv4 } from "uuid";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, useUpdateMyPresence } from "../liveblocks.config";

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
  const [slateMetadata, setSlateMetadata] = useState<{ name: string }>({ name: "Untitled Slate" });
  const [canWrite, setCanWrite] = useState(true);
  const updateMyPresence = useUpdateMyPresence();

  // Initialize Presence (Name and Color)
  useEffect(() => {
    const names = ["Creative Designer", "Lead Architect", "Product Visionary", "Swift Solver", "Bright Mind", "Visual Thinker"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const colors = ["#ff8a65", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#06b6d4"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    updateMyPresence({ 
      name: localStorage.getItem("user-email") || randomName,
      color: randomColor 
    });
  }, [updateMyPresence]);

  // Initialize Y.Doc and Provider
  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    // Initial permission check (will be refined with actual sharing logic)
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const isGuest = !localStorage.getItem("token");
    
    // Guests are read-only if no mode is specified, or if mode is 'read'
    if (mode === "read" || (isGuest && !mode)) {
      setCanWrite(false);
    } else {
      setCanWrite(true);
    }

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  const yElements = useMemo(() => {
    if (!doc) return null;
    return doc.getArray<WhiteboardElement>("elements");
  }, [doc]);

  const yMetadata = useMemo(() => {
    if (!doc) return null;
    return doc.getMap<any>("metadata");
  }, [doc]);

  const undoManager = useMemo(() => {
    if (!yElements) return null;
    return new Y.UndoManager(yElements);
  }, [yElements]);

  // Sync Y.Array and Y.Map with React state
  useEffect(() => {
    if (!yElements || !yMetadata) return;

    const handleElementsChange = () => {
      setState((prev) => ({
        ...prev,
        elements: yElements.toArray(),
      }));
    };

    const handleMetadataChange = () => {
      const name = yMetadata.get("name") || "Untitled Slate";
      setSlateMetadata({ name });
    };

    yElements.observe(handleElementsChange);
    yMetadata.observe(handleMetadataChange);
    
    handleElementsChange(); // Initial sync
    handleMetadataChange();

    // Handle initial import if flag is present
    const params = new URLSearchParams(window.location.search);
    if (params.get("import") === "true" && (window as any).pendingImportElements) {
      const elements = (window as any).pendingImportElements;
      delete (window as any).pendingImportElements;
      
      // Only inject if the room is empty to avoid overwriting collaborative state
      if (yElements.length === 0) {
        yElements.push(elements);
      }
    }

    return () => {
      yElements.unobserve(handleElementsChange);
      yMetadata.unobserve(handleMetadataChange);
    };
  }, [yElements, yMetadata]);

  useEffect(() => {
    (window as any).whiteboardElements = state.elements;
    
    // Auto-save: update lastModified in dashboard metadata
    const roomId = (window as any).currentWhiteboardRoomId;
    if (state.elements.length > 0 && roomId) {
      const saved = localStorage.getItem("my-slates");
      if (saved) {
        const slates = JSON.parse(saved);
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const now = new Date();
        const dateStr = `${now.getDate().toString().padStart(2, '0')}-${months[now.getMonth()]}-${now.getFullYear().toString().slice(-2)}`;
        
        const updated = slates.map((s: any) => 
          s.id === roomId ? { ...s, lastModified: dateStr } : s
        );
        localStorage.setItem("my-slates", JSON.stringify(updated));
      }
    }
  }, [state.elements]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addElement = useCallback((element: WhiteboardElement) => {
    if (!yElements || !canWrite) return;
    yElements.push([element]);
  }, [yElements, canWrite]);

  const updateElement = useCallback((id: string, updates: Partial<WhiteboardElement>) => {
    if (!yElements || !doc || !canWrite) return;
    
    doc.transact(() => {
      const elements = yElements.toArray();
      const index = elements.findIndex(el => el.id === id);
      if (index !== -1) {
        const current = elements[index];
        const updatedElement = { ...current, ...updates };
        yElements.delete(index);
        yElements.insert(index, [updatedElement]);
      }
    });
  }, [yElements, doc, canWrite]);

  const deleteElement = useCallback((id: string) => {
    if (!yElements || !doc || !canWrite) return;

    doc.transact(() => {
      const elements = yElements.toArray();
      const index = elements.findIndex(el => el.id === id);
      if (index !== -1) {
        yElements.delete(index);
      }
    });
    
    setState((prev) => ({
      ...prev,
      selectedIds: prev.selectedIds.filter((sid) => sid !== id),
    }));
  }, [yElements, doc, canWrite]);

  const setSlateName = useCallback((name: string) => {
    if (!yMetadata || !canWrite) return;
    yMetadata.set("name", name);
  }, [yMetadata, canWrite]);

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
  }, [yElements, doc, state.selectedIds, canWrite]);

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

  const selectAll = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIds: prev.elements.map(el => el.id)
    }));
  }, []);

  const undo = useCallback(() => {
    undoManager?.undo();
  }, [undoManager]);

  const redo = useCallback(() => {
    undoManager?.redo();
  }, [undoManager]);

  const deleteSelected = useCallback(() => {
    if (!yElements || !doc || !canWrite || state.selectedIds.length === 0) return;

    doc.transact(() => {
      state.selectedIds.forEach(id => {
        const elements = yElements.toArray();
        const index = elements.findIndex(el => el.id === id);
        if (index !== -1) {
          yElements.delete(index);
        }
      });
    });

    setState((prev) => ({
      ...prev,
      selectedIds: [],
    }));
  }, [yElements, doc, canWrite, state.selectedIds]);
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
    slateMetadata,
    setSlateName,
    canWrite,
    undo,
    redo,
    selectAll,
    deleteSelected,
  };
};
