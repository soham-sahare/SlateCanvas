"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Point, Tool, WhiteboardElement } from "@/types/whiteboard";
import { v4 as uuidv4 } from "uuid";

interface CanvasProps {
  elements: WhiteboardElement[];
  currentTool: Tool;
  zoom: number;
  offset: Point;
  onElementsChange: (elements: WhiteboardElement[]) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  selectedIds: string[];
}

export const Canvas: React.FC<CanvasProps> = ({
  elements,
  currentTool,
  zoom,
  offset,
  onElementsChange,
  onSelectionChange,
  selectedIds,
}) => {
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
      }
      
      // Handle selection highlights
      if (selectedIds.includes(el.id)) {
        ctx.save();
        ctx.strokeStyle = "#3b82f6"; // Blue-500
        ctx.lineWidth = 2 / zoom;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(el.x - 4, el.y - 4, el.width + 8, el.height + 8);
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentTool === "select") {
      // Basic selection logic later
      return;
    }

    const point = getCanvasCoords(e);
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
    };
    
    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint || !currentElement) return;

    const point = getCanvasCoords(e);
    const width = point.x - startPoint.x;
    const height = point.y - startPoint.y;

    setCurrentElement({
      ...currentElement,
      width,
      height,
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentElement) return;

    // Only add if it has some size
    if (Math.abs(currentElement.width) > 2 || Math.abs(currentElement.height) > 2) {
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
      onMouseLeave={handleMouseUp}
      className="absolute inset-0 z-0 touch-none bg-transparent"
    />
  );
};
