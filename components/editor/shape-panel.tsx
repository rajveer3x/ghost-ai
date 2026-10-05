"use client";

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RectangleHorizontal, Diamond, Circle, Pill, Cylinder, Hexagon } from 'lucide-react';
import { Panel } from '@xyflow/react';
import { renderShape } from './canvas-node';

const SHAPES = [
  { type: 'rectangle', icon: RectangleHorizontal, width: 120, height: 80 },
  { type: 'diamond', icon: Diamond, width: 100, height: 100 },
  { type: 'circle', icon: Circle, width: 80, height: 80 },
  { type: 'pill', icon: Pill, width: 120, height: 60 },
  { type: 'cylinder', icon: Cylinder, width: 80, height: 100 },
  { type: 'hexagon', icon: Hexagon, width: 100, height: 100 },
];

export function ShapePanel() {
  const dragPreviewsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragStart = (event: React.DragEvent, shapeType: string, width: number, height: number) => {
    const payload = JSON.stringify({ type: shapeType, width, height });
    event.dataTransfer.setData('application/reactflow-shape', payload);
    event.dataTransfer.effectAllowed = 'move';

    const previewElement = dragPreviewsRef.current[shapeType];
    if (previewElement) {
      event.dataTransfer.setDragImage(previewElement, width / 2, height / 2);
    }
  };

  const previews = mounted ? createPortal(
    <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none opacity-80" style={{ zIndex: 9999 }}>
      {SHAPES.map(shape => (
        <div
          key={`preview-${shape.type}`}
          ref={(el) => {
            if (el) dragPreviewsRef.current[shape.type] = el;
          }}
          style={{ width: shape.width, height: shape.height }}
          className="relative"
        >
          {renderShape(shape.type, false)}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <>
      {previews}
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
    </>
  );
}
