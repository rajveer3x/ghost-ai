"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";
import { Button } from "@/components/ui/button";

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const {
    activeDialog,
    projectId,
    projectName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
  } = useProjectDialogs();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCreateProject={openCreateDialog}
        onRenameProject={openRenameDialog}
        onDeleteProject={openDeleteDialog}
      />
      
      {/* Main Canvas Area */}
      <main className="flex-1 mt-14 flex flex-col items-center justify-center bg-muted/20 p-4">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-medium tracking-tight">Create a project or open an existing one</h1>
            <p className="text-muted-foreground text-sm">
              Start a new architecture workspace, or choose a project from the sidebar.
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </main>

      <ProjectDialogs
        activeDialog={activeDialog}
        projectId={projectId}
        projectName={projectName}
        onClose={closeDialogs}
      />
    </div>
  );
}

