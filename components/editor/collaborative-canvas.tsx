"use client";

import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { ReactFlow, MiniMap, Background, BackgroundVariant, ConnectionMode } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-flow/styles.css";

export function CollaborativeCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } = useLiveblocksFlow({
    suspense: true,
    nodes: {
      initial: [],
    },
    edges: {
      initial: [],
    },
  });

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
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
      </ReactFlow>
    </div>
  );
}
