"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudOff, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SaveButton() {
  const [status, setStatus] = useState<"default" | "saved" | "saving" | "error">("default");

  useEffect(() => {
    const handleStatus = (e: CustomEvent) => {
      setStatus(e.detail);
    };

    window.addEventListener("canvas-save-status", handleStatus as EventListener);
    return () => window.removeEventListener("canvas-save-status", handleStatus as EventListener);
  }, []);

  const handleManualSave = () => {
    window.dispatchEvent(new CustomEvent("trigger-canvas-save"));
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleManualSave}
      disabled={status === "saving"}
      className="border-zinc-800 bg-transparent hover:bg-zinc-800 text-zinc-300 w-28 flex justify-center"
    >
      {status === "default" && (
        <>
          <Save className="mr-2 h-4 w-4" />
          <span>Save</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Cloud className="mr-2 h-4 w-4" />
          <span>Saved</span>
        </>
      )}
      {status === "saving" && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      {status === "error" && (
        <>
          <CloudOff className="mr-2 h-4 w-4 text-red-400" />
          <span className="text-red-400">Error</span>
        </>
      )}
    </Button>
  );
}
