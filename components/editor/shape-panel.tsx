"use client";

import React from 'react';
import { RectangleHorizontal, Diamond, Circle, Pill, Cylinder, Hexagon } from 'lucide-react';
import { Panel } from '@xyflow/react';

const SHAPES = [
  { type: 'rectangle', icon: RectangleHorizontal, width: 120, height: 80 },
  { type: 'diamond', icon: Diamond, width: 100, height: 100 },
  { type: 'circle', icon: Circle, width: 80, height: 80 },
  { type: 'pill', icon: Pill, width: 120, height: 60 },
  { type: 'cylinder', icon: Cylinder, width: 80, height: 100 },
  { type: 'hexagon', icon: Hexagon, width: 100, height: 100 },
];

export function ShapePanel() {
  const onDragStart = (event: React.DragEvent, shapeType: string, width: number, height: number) => {
    const payload = JSON.stringify({ type: shapeType, width, height });
    event.dataTransfer.setData('application/reactflow-shape', payload);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Panel position="bottom-center" className="bg-zinc-900 border border-zinc-800 rounded-full flex items-center gap-2 px-4 py-2 shadow-lg mb-6">
      {SHAPES.map((shape) => (
        <button
          key={shape.type}
          className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={(e) => onDragStart(e, shape.type, shape.width, shape.height)}
          title={shape.type.charAt(0).toUpperCase() + shape.type.slice(1)}
        >
          <shape.icon className="w-5 h-5" />
        </button>
      ))}
    </Panel>
  );
}
