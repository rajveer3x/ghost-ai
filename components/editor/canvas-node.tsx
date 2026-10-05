"use client";

import { Handle, Position, NodeResizer, NodeToolbar, useReactFlow, type NodeProps } from '@xyflow/react';
import { useState, useRef, useEffect } from 'react';
import { NODE_COLORS } from '../../types/canvas';

export const renderShape = (shape: string, selected: boolean, fillColor: string = '#18181b') => {
  const stroke = selected ? '#3b82f6' : '#3f3f46';

  if (shape === 'rectangle' || shape === 'circle' || shape === 'pill') {
    const radiusClass = shape === 'circle' ? 'rounded-full' : shape === 'pill' ? 'rounded-[9999px]' : 'rounded-lg';
    const borderColor = selected ? 'border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]' : 'border-zinc-700';
    return (
      <div 
        className={`absolute inset-0 border-2 ${borderColor} ${radiusClass}`}
        style={{ backgroundColor: fillColor }}
      />
    );
  }

  const sw = selected ? "3" : "2";

  return (
    <svg 
      className="absolute inset-0 w-full h-full" 
      style={{ overflow: 'visible' }}
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      {shape === 'diamond' && (
        <polygon points="50,0 100,50 50,100 0,50" fill={fillColor} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      )}
      {shape === 'hexagon' && (
        <polygon points="25,0 75,0 100,50 75,100 25,100 0,50" fill={fillColor} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      )}
      {shape === 'cylinder' && (
        <>
          <path d="M 0,20 C 0,5 100,5 100,20 C 100,35 0,35 0,20" fill={fillColor} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
          <path d="M 0,20 L 0,80 C 0,95 100,95 100,80 L 100,20" fill={fillColor} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
        </>
      )}
    </svg>
  );
};

export function CanvasNode({ id, data, selected }: NodeProps) {
  const label = (data?.label as string) || '';
  const shape = (data?.shape as string) || 'rectangle';
  const colorFill = (data?.color as string) || NODE_COLORS[0].fill;
  const activeColorTheme = NODE_COLORS.find(c => c.fill === colorFill) || NODE_COLORS[0];

  const { updateNodeData } = useReactFlow();
  
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    }
  }, [isEditing]);

  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditing) {
      adjustHeight();
    }
  }, [label, isEditing]);

  const onDoubleClick = () => {
    setIsEditing(true);
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { label: e.target.value });
  };

  const onColorSelect = (colorInfo: typeof NODE_COLORS[number]) => {
    updateNodeData(id, { color: colorInfo.fill });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const onBlur = () => {
    setIsEditing(false);
  };
  
  return (
    <div 
      className="w-full h-full relative flex items-center justify-center group"
      style={{ color: activeColorTheme.text }}
      onDoubleClick={onDoubleClick}
    >
      <NodeToolbar isVisible={selected} position={Position.Top} className="flex gap-1.5 p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl mb-2 nodrag nopan">
        {NODE_COLORS.map(colorInfo => {
          const isActive = colorInfo.fill === activeColorTheme.fill;
          return (
            <button
              key={colorInfo.name}
              onClick={() => onColorSelect(colorInfo)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 10px ${colorInfo.text}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = isActive ? `0 0 8px ${colorInfo.text}50` : 'none';
              }}
              className={`w-6 h-6 rounded-md border transition-all duration-200 flex-shrink-0 ${isActive ? 'border-zinc-300 scale-110 z-10' : 'border-zinc-700 hover:border-zinc-500 hover:scale-105'}`}
              style={{ 
                backgroundColor: colorInfo.fill, 
                boxShadow: isActive ? `0 0 8px ${colorInfo.text}50` : 'none',
              }}
              title={colorInfo.name}
            />
          );
        })}
      </NodeToolbar>

      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={40} 
        minHeight={40} 
        handleStyle={{ width: 8, height: 8, borderRadius: 2, border: '1px solid #18181b', backgroundColor: '#3b82f6' }}
      />
      
      {renderShape(shape, selected, activeColorTheme.fill)}
      
      <div className="relative z-10 w-full px-2 flex items-center justify-center">
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={label}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            placeholder="Type..."
            className="nodrag nopan w-full bg-transparent text-center text-sm font-medium outline-none resize-none overflow-hidden placeholder-current opacity-90"
            rows={1}
            style={{ 
              minHeight: '1.5em', 
              wordBreak: 'break-word',
              color: 'inherit'
            }}
          />
        ) : (
          <div className="text-sm font-medium text-center pointer-events-none whitespace-pre-wrap break-words w-full" style={{ color: 'inherit' }}>
            {label ? label : <span style={{ opacity: 0.5 }}>Type...</span>}
          </div>
        )}
      </div>
      
      <Handle id="top" type="source" position={Position.Top} className="!z-50 w-2 h-2 bg-white border-2 border-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle id="right" type="source" position={Position.Right} className="!z-50 w-2 h-2 bg-white border-2 border-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!z-50 w-2 h-2 bg-white border-2 border-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle id="left" type="source" position={Position.Left} className="!z-50 w-2 h-2 bg-white border-2 border-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
