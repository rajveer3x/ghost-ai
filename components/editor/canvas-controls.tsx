"use client";

import { Panel, useReactFlow } from "@xyflow/react";
import { ZoomIn, ZoomOut, Maximize, Undo2, Redo2 } from "lucide-react";
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@liveblocks/react/suspense";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Button } from "@/components/ui/button";

export function CanvasControls() {
  const reactFlowInstance = useReactFlow();
  const { zoomIn, zoomOut, fitView } = reactFlowInstance;
  
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useKeyboardShortcuts({ reactFlowInstance, undo, redo });

  return (
    <Panel position="bottom-left" className="bg-zinc-900 border border-zinc-800 rounded-full flex items-center p-1 shadow-lg ml-6 mb-24 z-50">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          onClick={() => zoomOut({ duration: 200 })}
          title="Zoom Out (-)"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          onClick={() => fitView({ duration: 200 })}
          title="Fit View"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          onClick={() => zoomIn({ duration: 200 })}
          title="Zoom In (+)"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-6 bg-zinc-800 mx-1" />

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-50"
          onClick={() => undo()}
          disabled={!canUndo}
          title="Undo (Cmd/Ctrl + Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 disabled:opacity-50"
          onClick={() => redo()}
          disabled={!canRedo}
          title="Redo (Cmd/Ctrl + Y)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
      </div>
    </Panel>
  );
}
