"use client";

import React from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import { ReactFlowProvider } from "@xyflow/react";
import { CollaborativeCanvas } from "./collaborative-canvas";

class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface CanvasWrapperProps {
  roomId: string;
}

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <ErrorBoundary fallback={<div className="flex h-full w-full items-center justify-center text-red-500">Failed to connect to the canvas room. Please try again later.</div>}>
      <ClientSideSuspense fallback={<div className="flex h-full w-full items-center justify-center text-zinc-400">Loading canvas...</div>}>
        <ReactFlowProvider>
          <CollaborativeCanvas projectId={roomId} />
        </ReactFlowProvider>
      </ClientSideSuspense>
    </ErrorBoundary>
  );
}
