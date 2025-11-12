"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Point, Tool, WhiteboardElement } from "@/types/whiteboard";
import { v4 as uuidv4 } from "uuid";
import { useUpdateMyPresence } from "../../liveblocks.config";

interface CanvasProps {
  elements: WhiteboardElement[];
  currentTool: Tool;
  zoom: number;
  offset: Point;
  onElementsChange: (elements: WhiteboardElement[]) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  onOffsetChange: (offset: Point) => void;
  selectedIds: string[];
}
export const Canvas: React.FC<CanvasProps> = ({
  elements,
  currentTool,
  zoom,
  offset,
  onElementsChange,
  onSelectionChange,
  onOffsetChange,
  selectedIds,
}) => {
  const updateMyPresence = useUpdateMyPresence();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentElement, setCurrentElement] = useState<WhiteboardElement | null>(null);

  // Drawing elements to canvas
  const drawElements = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    // Draw all elements
    [...elements, ...(currentElement ? [currentElement] : [])].forEach((el) => {
      ctx.beginPath();
      ctx.strokeStyle = el.strokeColor;
      ctx.fillStyle = el.backgroundColor;
      ctx.lineWidth = el.strokeWidth;
      ctx.globalAlpha = el.opacity;

      if (el.type === "rect") {
        ctx.strokeRect(el.x, el.y, el.width, el.height);
        if (el.backgroundColor !== "transparent") {
          ctx.fillRect(el.x, el.y, el.width, el.height);
        }
      } else if (el.type === "ellipse") {
        ctx.ellipse(
          el.x + el.width / 2,
          el.y + el.height / 2,
          Math.abs(el.width / 2),
          Math.abs(el.height / 2),
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        if (el.backgroundColor !== "transparent") {
          ctx.fill();
        }
      } else if (el.type === "diamond") {
        const cx = el.x + el.width / 2;
        const cy = el.y + el.height / 2;
        ctx.moveTo(cx, el.y);
        ctx.lineTo(el.x + el.width, cy);
        ctx.lineTo(cx, el.y + el.height);
        ctx.lineTo(el.x, cy);
        ctx.closePath();
        ctx.stroke();
        if (el.backgroundColor !== "transparent") {
          ctx.fill();
        }
      } else if (el.type === "line" || el.type === "arrow") {
        ctx.moveTo(el.x, el.y);
        ctx.lineTo(el.x + el.width, el.y + el.height);
        ctx.stroke();

        if (el.type === "arrow") {
          // Arrow head
          const angle = Math.atan2(el.height, el.width);
          const headLen = 15 / zoom;
          ctx.lineTo(
            el.x + el.width - headLen * Math.cos(angle - Math.PI / 6),
            el.y + el.height - headLen * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(el.x + el.width, el.y + el.height);
          ctx.lineTo(
            el.x + el.width - headLen * Math.cos(angle + Math.PI / 6),
            el.y + el.height - headLen * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        }
      } else if (el.type === "draw") {
        const drawEl = el as any;
        if (drawEl.points && drawEl.points.length > 0) {
          ctx.moveTo(drawEl.points[0].x, drawEl.points[0].y);
          for (let i = 1; i < drawEl.points.length; i++) {
            ctx.lineTo(drawEl.points[i].x, drawEl.points[i].y);
          }
          ctx.stroke();
        }
      } else if (el.type === "text") {
        const textEl = el as any;
        ctx.font = `${textEl.fontSize}px ${textEl.fontFamily || "Inter"}`;
        ctx.textBaseline = "top";
        ctx.fillText(textEl.text, textEl.x, textEl.y);
      }
      
      // Handle selection highlights
      if (selectedIds.includes(el.id)) {
        ctx.save();
        ctx.strokeStyle = "#3b82f6"; // Blue-500
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([5, 5]);
        
        const x = Math.min(el.x, el.x + el.width);
        const y = Math.min(el.y, el.y + el.height);
        const w = Math.abs(el.width);
        const h = Math.abs(el.height);
        
        ctx.strokeRect(x - 4, y - 4, w + 8, h + 8);
        
        // Draw handles at corners
        ctx.setLineDash([]);
        ctx.fillStyle = "white";
        ctx.strokeStyle = "#3b82f6";
        const handleSize = 8 / zoom;
        
        const corners = [
          { x, y },
          { x: x + w, y },
          { x, y: y + h },
          { x: x + w, y: y + h }
        ];
        
        corners.forEach(corner => {
          ctx.beginPath();
          ctx.rect(corner.x - handleSize/2, corner.y - handleSize/2, handleSize, handleSize);
          ctx.fill();
          ctx.stroke();
        });
        
        ctx.restore();
      }
    });

    ctx.restore();
  }, [elements, currentElement, zoom, offset, selectedIds]);

  useEffect(() => {
    drawElements();
  }, [drawElements]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      drawElements();
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [drawElements]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left - offset.x) / zoom,
      y: (clientY - rect.top - offset.y) / zoom,
    };
  };

  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpacePressed(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") setIsSpacePressed(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getCanvasCoords(e);

    if (isSpacePressed) {
      setIsDrawing(false);
      setStartPoint({ x: e.clientX, y: e.clientY }); // Screen coords for panning
      return;
    }

    if (currentTool === "text") {
      const text = window.prompt("Enter text:");
      if (text) {
        const tempCtx = canvasRef.current?.getContext("2d");
        const newElement: WhiteboardElement = {
          id: uuidv4(),
          type: "text",
          x: point.x,
          y: point.y,
          width: tempCtx?.measureText(text).width || text.length * 10,
          height: 24,
          strokeColor: "#ff8a65",
          backgroundColor: "transparent",
          strokeWidth: 1,
          opacity: 1,
          text,
          fontSize: 20,
          fontFamily: "Inter",
        } as any;
        onElementsChange([...elements, newElement]);
      }
      return;
    }

    if (currentTool === "eraser") {
      const element = (elements as any).slice().reverse().find((el: any) => {
        if (el.type === "draw") {
          const minX = Math.min(...el.points.map((p: any) => p.x));
          const maxX = Math.max(...el.points.map((p: any) => p.x));
          const minY = Math.min(...el.points.map((p: any) => p.y));
          const maxY = Math.max(...el.points.map((p: any) => p.y));
          return point.x >= minX - 10 && point.x <= maxX + 10 && point.y >= minY - 10 && point.y <= maxY + 10;
        }
        const x = Math.min(el.x, el.x + el.width);
        const y = Math.min(el.y, el.y + el.height);
        const w = Math.abs(el.width);
        const h = Math.abs(el.height);
        return point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h;
      });

      if (element) {
        onElementsChange(elements.filter(e => e.id !== element.id));
      }
      return;
    }

    if (currentTool === "select") {
      // Check handles first
      if (selectedIds.length === 1) {
        const el = elements.find(e => e.id === selectedIds[0]);
        if (el && el.type !== "draw") {
          const x = Math.min(el.x, el.x + el.width);
          const y = Math.min(el.y, el.y + el.height);
          const w = Math.abs(el.width);
          const h = Math.abs(el.height);
          const handleSize = 10 / zoom;

          const handles = [
            { id: "nw", x, y },
            { id: "ne", x: x + w, y },
            { id: "sw", x, y: y + h },
            { id: "se", x: x + w, y: y + h }
          ];

          const clickedHandle = handles.find(h => 
            point.x >= h.x - handleSize/2 && point.x <= h.x + handleSize/2 &&
            point.y >= h.y - handleSize/2 && point.y <= h.y + handleSize/2
          );

          if (clickedHandle) {
            setResizeHandle(clickedHandle.id);
            setStartPoint(point);
            return;
          }
        }
      }

      const element = (elements as any).slice().reverse().find((el: any) => {
        // Simple hit detection logic repeated from hook or shared
        if (el.type === "draw") {
          const minX = Math.min(...el.points.map((p: any) => p.x));
          const maxX = Math.max(...el.points.map((p: any) => p.x));
          const minY = Math.min(...el.points.map((p: any) => p.y));
          const maxY = Math.max(...el.points.map((p: any) => p.y));
          return point.x >= minX - 10 && point.x <= maxX + 10 && point.y >= minY - 10 && point.y <= maxY + 10;
        }
        const x = Math.min(el.x, el.x + el.width);
        const y = Math.min(el.y, el.y + el.height);
        const w = Math.abs(el.width);
        const h = Math.abs(el.height);
        return point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h;
      });

      if (element) {
        onSelectionChange([element.id]);
        setIsDrawing(false);
        setStartPoint(point); // Store for drag delta
      } else {
        onSelectionChange([]);
        setStartPoint(point); // Start selection marquee in future
      }
      return;
    }

    setIsDrawing(true);
    setStartPoint(point);

    const newElement: WhiteboardElement = {
      id: uuidv4(),
      type: currentTool as any,
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      strokeColor: "#ff8a65", // Slate Orange
      backgroundColor: "transparent",
      strokeWidth: 2,
      opacity: 1,
      ...(currentTool === "draw" ? { points: [point] } : {}),
    } as any;
    
    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateMyPresence({ cursor: { x: e.clientX, y: e.clientY } });

    if (isSpacePressed && startPoint) {
      const deltaX = e.clientX - startPoint.x;
      const deltaY = e.clientY - startPoint.y;
      onOffsetChange({
        x: offset.x + deltaX,
        y: offset.y + deltaY,
      });
      setStartPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    const point = getCanvasCoords(e);

    if (currentTool === "select" && startPoint && selectedIds.length === 1) {
      const deltaX = point.x - startPoint.x;
      const deltaY = point.y - startPoint.y;

      if (resizeHandle) {
        const updatedElements = elements.map(el => {
          if (el.id === selectedIds[0]) {
            let { x, y, width, height } = el;
            if (resizeHandle === "nw") {
              return { ...el, x: x + deltaX, y: y + deltaY, width: width - deltaX, height: height - deltaY };
            } else if (resizeHandle === "ne") {
              return { ...el, y: y + deltaY, width: width + deltaX, height: height - deltaY };
            } else if (resizeHandle === "sw") {
              return { ...el, x: x + deltaX, width: width - deltaX, height: height + deltaY };
            } else if (resizeHandle === "se") {
              return { ...el, width: width + deltaX, height: height + deltaY };
            }
          }
          return el;
        });
        onElementsChange(updatedElements);
        setStartPoint(point);
        return;
      }

      // Drag/Move
      const updatedElements = elements.map(el => {
        if (selectedIds.includes(el.id)) {
          if (el.type === "draw") {
            const drawEl = el as any;
            return {
              ...drawEl,
              points: drawEl.points.map((p: any) => ({
                x: p.x + deltaX,
                y: p.y + deltaY,
              })),
            };
          }
          return { ...el, x: el.x + deltaX, y: el.y + deltaY };
        }
        return el;
      });

      onElementsChange(updatedElements);
      setStartPoint(point); // Update for next move
      return;
    }

    if (!isDrawing || !startPoint || !currentElement) return;

    if (currentTool === "draw") {
      const drawEl = currentElement as any;
      setCurrentElement({
        ...drawEl,
        points: [...drawEl.points, point],
      });
    } else {
      const width = point.x - startPoint.x;
      const height = point.y - startPoint.y;

      setCurrentElement({
        ...currentElement,
        width,
        height,
      });
    }
  };

  const handleMouseUp = () => {
    setResizeHandle(null);
    if (isSpacePressed || currentTool === "select") {
      setStartPoint(null);
      return;
    }

    if (!isDrawing || !currentElement) return;

    // Only add if it has some size or points
    const deservesAddition = currentTool === "draw" 
      ? (currentElement as any).points.length > 2
      : Math.abs(currentElement.width) > 2 || Math.abs(currentElement.height) > 2;

    if (deservesAddition) {
      onElementsChange([...elements, currentElement]);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentElement(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        updateMyPresence({ cursor: null });
      }}
      style={{ cursor: isSpacePressed ? "grab" : (resizeHandle ? "nwse-resize" : "default") }}
      className="absolute inset-0 z-0 touch-none bg-transparent"
    />
  );
};
