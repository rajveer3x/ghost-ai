"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectActions } from "@/hooks/use-project-actions";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
}

interface EditorHomeClientProps {
  myProjects: Project[];
  sharedProjects: Project[];
}

export function EditorHomeClient({ myProjects, sharedProjects }: EditorHomeClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const {
    activeDialog,
    projectId,
    projectName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
    createProject,
    renameProject,
    deleteProject
  } = useProjectActions();

  return (
    <div className="flex h-screen w-full bg-[#0E0E10] text-zinc-100 overflow-hidden flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        <div className={`shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0 hidden'}`}>
          <ProjectSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            myProjects={myProjects}
            sharedProjects={sharedProjects}
            onCreateProject={openCreateDialog}
            onRenameProject={openRenameDialog}
            onDeleteProject={openDeleteDialog}
          />
        </div>
        
        {/* Main Canvas Area */}
        <main className="flex-1 bg-[#141415] rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg flex items-center justify-center min-w-0">
          <div className="text-center max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-100">Create a project or open an existing one</h1>
              <p className="text-zinc-400 text-sm">
                Start a new architecture workspace, or choose a project from the sidebar.
              </p>
            </div>
            <Button 
              onClick={openCreateDialog}
              className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </div>
        </main>
      </div>

      <ProjectDialogs
        activeDialog={activeDialog}
        projectId={projectId}
        projectName={projectName}
        onClose={closeDialogs}
        onCreateProject={createProject}
        onRenameProject={renameProject}
        onDeleteProject={deleteProject}
      />
    </div>
  );
}
