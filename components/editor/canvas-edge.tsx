"use client";

import { BaseEdge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow } from '@xyflow/react';
import { useState, useRef, useEffect } from 'react';

export function CanvasEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { updateEdgeData } = useReactFlow();
  const label = (data?.label as string) || '';
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Wait a tick to set selection so input handles focus properly
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
        }
      }, 0);
    }
  }, [isEditing]);

  const onDoubleClick = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setIsEditing(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateEdgeData(id, { label: e.target.value });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      e.stopPropagation();
      setIsEditing(false);
    }
  };

  const onBlur = () => {
    setIsEditing(false);
  };

  // Keep edges slightly dimmed at rest, brighten when hovered/selected
  const strokeColor = selected ? '#ffffff' : '#a1a1aa';
  const strokeWidth = 2;

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          transition: 'stroke 0.2s',
        }} 
      />
      
      {/* Invisible wider path for easier clicking/hovering */}
      <path
        d={edgePath}
        fill="none"
        strokeOpacity={0}
        strokeWidth={20}
        className="react-flow__edge-interaction"
        onDoubleClick={onDoubleClick}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onDoubleClick={onDoubleClick}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded-full text-xs border border-blue-500 outline-none text-center min-w-[60px]"
              style={{ width: `${Math.max(60, label.length * 8 + 24)}px` }}
            />
          ) : label ? (
            <div className="bg-zinc-800 text-zinc-100 px-2 py-1 rounded-full text-xs border border-zinc-700 shadow-sm whitespace-nowrap">
              {label}
            </div>
          ) : selected ? (
            <div className="bg-zinc-800/80 text-zinc-400 px-2 py-1 rounded-full text-xs border border-zinc-700/50 shadow-sm whitespace-nowrap opacity-50 cursor-pointer">
              Double-click to label
            </div>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
