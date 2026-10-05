"use client";

import { useCallback, useRef } from "react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { ReactFlow, MiniMap, Background, BackgroundVariant, ConnectionMode, useReactFlow, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-flow/styles.css";
import { ShapePanel } from "./shape-panel";
import { CanvasNode } from "./canvas-node";

const nodeTypes = {
  canvasNode: CanvasNode,
};

export function CollaborativeCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } = useLiveblocksFlow<Node, Edge>({
    suspense: true,
    nodes: {
      initial: [],
    },
    edges: {
      initial: [],
    },
  });

  const { screenToFlowPosition } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const typeData = event.dataTransfer.getData('application/reactflow-shape');
      if (!typeData) return;

      const payload = JSON.parse(typeData);
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      position.x -= payload.width / 2;
      position.y -= payload.height / 2;

      const newNode: Node = {
        id: `${payload.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'canvasNode',
        position,
        data: { label: '', shape: payload.type },
        style: { width: payload.width, height: payload.height },
      };

      onNodesChange([{ type: 'add', item: newNode }]);
    },
    [screenToFlowPosition, onNodesChange],
  );

  return (
    <div className="relative h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        colorMode="dark"
        fitView
      >
        <Background variant={BackgroundVariant.Dots} color="#27272a" gap={16} size={1.5} />
        <MiniMap 
          nodeColor="#3f3f46" 
          maskColor="rgba(0, 0, 0, 0.7)"
          style={{ backgroundColor: '#18181b' }}
        />
        <ShapePanel />
      </ReactFlow>
    </div>
  );
}
