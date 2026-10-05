import { useEffect, useState, useRef } from "react";
import type { Node, Edge } from "@xyflow/react";

type SaveStatus = "default" | "saved" | "saving" | "error";

export function useCanvasAutosave(
  projectId: string,
  nodes: Node[],
  edges: Edge[],
  debounceMs: number = 2000
) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("default");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [nodes, edges]);

  const performSave = async (currentNodes: Node[], currentEdges: Edge[]) => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/projects/${projectId}/canvas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes: currentNodes, edges: currentEdges }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        console.error("Autosave response error:", res.status, errData);
        throw new Error("Failed to save");
      }

      setSaveStatus("saved");
    } catch (error) {
      console.error("Autosave error:", error);
      setSaveStatus("error");
    }
    
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    resetTimeoutRef.current = setTimeout(() => {
      setSaveStatus("default");
    }, 2000);
  };

  useEffect(() => {
    const handleManualSave = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      performSave(nodesRef.current, edgesRef.current);
    };
    window.addEventListener("trigger-canvas-save", handleManualSave);
    return () => window.removeEventListener("trigger-canvas-save", handleManualSave);
  }, [projectId]); // nodesRef and edgesRef handle latest state

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("saving");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      performSave(nodesRef.current, edgesRef.current);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [nodes, edges, projectId, debounceMs]);

  return { saveStatus };
}
