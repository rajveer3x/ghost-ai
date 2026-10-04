"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Canvas Area */}
      <main className="flex-1 mt-14 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h1 className="text-2xl font-medium tracking-tight mb-2">Canvas Area</h1>
          <p className="text-muted-foreground text-sm">Select a project or create a new one to begin.</p>
        </div>
      </main>
    </div>
  );
}
