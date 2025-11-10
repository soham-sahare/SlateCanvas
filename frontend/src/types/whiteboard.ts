export type Tool = "select" | "rect" | "ellipse" | "diamond" | "line" | "arrow" | "draw" | "text" | "eraser";

export type ElementType = "rect" | "ellipse" | "diamond" | "line" | "arrow" | "draw" | "text";

export interface Point {
  x: number;
  y: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  opacity: number;
}

export interface DrawElement extends BaseElement {
  type: "draw";
  points: Point[];
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
}

export type WhiteboardElement = BaseElement | DrawElement | TextElement;

export interface WhiteboardState {
  elements: WhiteboardElement[];
  selectedIds: string[];
  currentTool: Tool;
  isDragging: boolean;
  isDrawing: boolean;
  zoom: number;
  offset: Point;
}
