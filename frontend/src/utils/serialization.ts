import protobuf from "protobufjs";
import { WhiteboardElement } from "@/types/whiteboard";

// The proto definition as a string (can also load from file if configured)
const protoDefinition = `
syntax = "proto3";

package whiteboard;

message Point {
  float x = 1;
  float y = 2;
}

message Element {
  string id = 1;
  string type = 2;
  float x = 3;
  float y = 4;
  float width = 5;
  float height = 6;
  string strokeColor = 7;
  string backgroundColor = 8;
  float strokeWidth = 9;
  float opacity = 10;
  repeated Point points = 11;
  string text = 12;
  float fontSize = 13;
  string fontFamily = 14;
}

message WhiteboardState {
  string id = 1;
  string name = 2;
  repeated Element elements = 3;
}
`;

let root: protobuf.Root | null = null;
let WhiteboardState: protobuf.Type | null = null;

const initProto = () => {
  if (!root) {
    root = protobuf.parse(protoDefinition).root;
    WhiteboardState = root.lookupType("whiteboard.WhiteboardState");
  }
  return WhiteboardState;
};

export const serializeBoard = (id: string, name: string, elements: WhiteboardElement[]): Uint8Array => {
  const type = initProto();
  if (!type) throw new Error("Proto not initialized");

  const message = type.create({ id, name, elements });
  return type.encode(message).finish();
};

export const deserializeBoard = (buffer: Uint8Array): { id: string, name: string, elements: WhiteboardElement[] } => {
  const type = initProto();
  if (!type) throw new Error("Proto not initialized");

  const message = type.decode(buffer);
  return type.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
    defaults: true,
    arrays: true,
    objects: true,
    oneofs: true
  }) as any;
};

// Helper to download binary file
export const downloadSlateFile = (id: string, name: string, elements: WhiteboardElement[]) => {
  const buffer = serializeBoard(id, name, elements);
  const blob = new Blob([buffer] as any, { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "untitled";
  a.download = `${safeName}.slatecanvas`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importSlateFile = (file: File): Promise<{ id: string, name: string, elements: WhiteboardElement[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = new Uint8Array(e.target?.result as ArrayBuffer);
        const data = deserializeBoard(buffer);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};
