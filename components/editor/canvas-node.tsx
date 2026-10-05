"use client";

import { Handle, Position, type NodeProps } from '@xyflow/react';

const renderShape = (shape: string, selected: boolean) => {
  const stroke = selected ? '#3b82f6' : '#3f3f46';
  const fill = '#18181b';

  if (shape === 'rectangle' || shape === 'circle' || shape === 'pill') {
    const radiusClass = shape === 'circle' ? 'rounded-full' : shape === 'pill' ? 'rounded-[9999px]' : 'rounded-lg';
    const borderColor = selected ? 'border-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]' : 'border-zinc-700';
    return <div className={`absolute inset-0 bg-zinc-900 border-2 ${borderColor} ${radiusClass}`} />;
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
        <polygon points="50,0 100,50 50,100 0,50" fill={fill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      )}
      {shape === 'hexagon' && (
        <polygon points="25,0 75,0 100,50 75,100 25,100 0,50" fill={fill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
      )}
      {shape === 'cylinder' && (
        <>
          <path d="M 0,20 C 0,5 100,5 100,20 C 100,35 0,35 0,20" fill={fill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
          <path d="M 0,20 L 0,80 C 0,95 100,95 100,80 L 100,20" fill={fill} stroke={stroke} strokeWidth={sw} vectorEffect="non-scaling-stroke" />
        </>
      )}
    </svg>
  );
};

export function CanvasNode({ data, selected }: NodeProps) {
  const label = (data?.label as string) || '';
  const shape = (data?.shape as string) || 'rectangle';
  
  return (
    <div className="w-full h-full relative flex items-center justify-center text-zinc-100 group">
      {renderShape(shape, selected)}
      <div className="relative z-10 text-sm font-medium text-center px-2 pointer-events-none">
        {label}
      </div>
      
      <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
