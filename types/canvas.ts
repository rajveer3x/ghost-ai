export type CanvasNode = {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: {
    label?: string;
    color?: string;
    shape?: string;
    [key: string]: unknown;
  };
};

export type CanvasEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  [key: string]: unknown;
};

export type canvasNode = CanvasNode;
export type canvasEdge = CanvasEdge;

