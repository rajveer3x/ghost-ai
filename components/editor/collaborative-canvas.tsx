"use client";

import { useCallback, useRef, useEffect } from "react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import { useMyPresence } from "@liveblocks/react";
import { ReactFlow, MiniMap, Background, BackgroundVariant, ConnectionMode, useReactFlow, MarkerType, type Node, type Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-flow/styles.css";
import { ShapePanel } from "./shape-panel";
import { CanvasNode } from "./canvas-node";
import { CanvasEdge } from "./canvas-edge";
import { CanvasControls } from "./canvas-controls";
import { LiveCursors } from "./live-cursors";
import { PresenceAvatars } from "./presence-avatars";
import { useCanvasAutosave } from "@/hooks/use-canvas-autosave";

const nodeTypes = {
  canvasNode: CanvasNode,
};

const edgeTypes = {
  canvasEdge: CanvasEdge,
};

export function CollaborativeCanvas({ projectId }: { projectId: string }) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } = useLiveblocksFlow<Node, Edge>({
    suspense: true,
    nodes: {
      initial: [],
    },
    edges: {
      initial: [],
    },
  });

  const { screenToFlowPosition, setNodes, setEdges, fitView } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  const [, updateMyPresence] = useMyPresence();
  
  const { saveStatus } = useCanvasAutosave(projectId, nodes, edges);

  const hasFittedView = useRef(false);

  useEffect(() => {
    // If the room already has nodes when we mount, fit view once
    if (!hasFittedView.current && nodes.length > 0) {
      setTimeout(() => fitView({ maxZoom: 1 }), 50);
      hasFittedView.current = true;
    }
  }, []); // Run ONLY on mount!

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("canvas-save-status", { detail: saveStatus }));
    }
  }, [saveStatus]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).reactFlowInstance = {
        getNodes: () => nodes,
        getEdges: () => edges,
      };
    }
  }, [nodes, edges]);

  useEffect(() => {
    // Load initial canvas state from backend if room is empty
    const loadInitialState = async () => {
      if (nodes.length === 0 && edges.length === 0) {
        try {
          const res = await fetch(`/api/projects/${projectId}/canvas`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.nodes && data.nodes.length > 0) {
              setNodes(data.nodes);
              setEdges(data.edges || []);
              setTimeout(() => fitView({ maxZoom: 1 }), 50);
            }
          }
        } catch (error) {
          console.error("Failed to load initial canvas state", error);
        }
        hasFittedView.current = true; // Mark as fitted so subsequent drops don't zoom
      }
    };
    
    // We only want to attempt this once after the Liveblocks initial sync.
    // If it's already synced and empty, we load.
    // Since useLiveblocksFlow suspense is true, it's synced on mount.
    loadInitialState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleImportTemplate = (e: CustomEvent) => {
      const template = e.detail;
      if (template) {
        setNodes(template.nodes);
        setEdges(template.edges);
      }
    };
    
    window.addEventListener("import-template", handleImportTemplate as EventListener);
    return () => window.removeEventListener("import-template", handleImportTemplate as EventListener);
  }, [setNodes, setEdges]);

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

  const handlePointerMove = useCallback((e: React.MouseEvent) => {
    const position = screenToFlowPosition({
      x: e.clientX,
      y: e.clientY,
    });
    
    updateMyPresence({ cursor: position });
  }, [screenToFlowPosition, updateMyPresence]);

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  return (
    <div 
      className="relative h-full w-full" 
      ref={reactFlowWrapper}
    >
      <PresenceAvatars />
      <LiveCursors />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'canvasEdge',
          markerEnd: { type: MarkerType.ArrowClosed, color: '#e4e4e7' },
        }}
        connectionMode={ConnectionMode.Loose}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} color="#27272a" gap={16} size={1.5} />
        <MiniMap 
          nodeColor="#3f3f46" 
          maskColor="rgba(0, 0, 0, 0.7)"
          style={{ backgroundColor: '#18181b' }}
        />
        <ShapePanel />
        <CanvasControls />
      </ReactFlow>
    </div>
  );
}
