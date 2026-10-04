"use client";

import { useState } from "react";
import { Share, MessageSquare, PanelRightClose, PanelRightOpen } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  name: string;
}

interface EditorWorkspaceClientProps {
  project: Project;
  myProjects: Project[];
  sharedProjects: Project[];
  isOwner: boolean;
}

export function EditorWorkspaceClient({
  project,
  myProjects,
  sharedProjects,
  isOwner,
}: EditorWorkspaceClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

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
    deleteProject,
  } = useProjectActions();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        projectName={project.name}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsShareDialogOpen(true)}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            >
              {isRightSidebarOpen ? (
                <PanelRightClose className="h-5 w-5" />
              ) : (
                <PanelRightOpen className="h-5 w-5" />
              )}
            </Button>
          </>
        }
      />
      
      <ShareDialog
        projectId={project.id}
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        isOwner={isOwner}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        myProjects={myProjects}
        sharedProjects={sharedProjects}
        onCreateProject={openCreateDialog}
        onRenameProject={openRenameDialog}
        onDeleteProject={openDeleteDialog}
        activeProjectId={project.id}
      />

      {/* Main Content Area */}
      <div className="flex-1 mt-14 flex overflow-hidden">
        {/* Central Canvas Placeholder */}
        <main className="flex-1 bg-zinc-950 flex items-center justify-center relative z-0">
          <div className="text-center text-zinc-400">
            <p className="text-sm uppercase tracking-widest opacity-50 mb-2">Canvas Area</p>
            <p>Interactive architecture canvas will go here.</p>
          </div>
        </main>

        {/* Right Sidebar Placeholder (AI Chat) */}
        {isRightSidebarOpen && (
          <aside className="w-80 border-l border-border bg-background flex flex-col z-10 shrink-0 shadow-lg">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-medium">AI Assistant</h3>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center text-muted-foreground text-sm">
              AI chat interface placeholder
            </div>
          </aside>
        )}
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

