"use client";

import { useState } from "react";
import { Plus, LayoutTemplate } from "lucide-react";
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
    <div className="flex h-screen w-full bg-[#080809] text-zinc-100 overflow-hidden flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden p-2 gap-2 relative">
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
        <main className="flex-1 bg-[#111114] rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg flex items-center justify-center min-w-0">
          {/* Subtle dot pattern background */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          
          <div className="text-center max-w-md mx-auto space-y-8 relative z-10">
            <div className="mx-auto w-20 h-20 bg-[#18181c] rounded-2xl border border-zinc-800/60 flex items-center justify-center shadow-xl shadow-black/20">
              <LayoutTemplate className="w-8 h-8 text-zinc-400" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Your Architecture Workspace</h1>
              <p className="text-zinc-400 text-sm leading-relaxed px-4">
                Create a new project to start designing your system architecture, or open an existing workspace from the sidebar.
              </p>
            </div>
            
            <Button 
              onClick={openCreateDialog}
              className="bg-[#00c8d4] hover:bg-[#00c8d4]/90 text-black font-medium h-11 px-6 rounded-lg shadow-lg shadow-[#00c8d4]/10 transition-all hover:shadow-[#00c8d4]/20"
            >
              <Plus className="mr-2 h-4 w-4" strokeWidth={2.5} /> Create New Project
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
