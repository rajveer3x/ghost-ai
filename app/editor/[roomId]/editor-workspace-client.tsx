"use client";

import { useState } from "react";
import { Share, MessageSquare, PanelRightClose, PanelRightOpen, Sparkles, LayoutTemplate } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal";
import { useProjectActions } from "@/hooks/use-project-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";
import { LiveblocksProvider, RoomProvider } from "@liveblocks/react/suspense";
import { AiSidebar } from "@/components/editor/ai-sidebar";

import { SaveButton } from "@/components/editor/save-button";

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
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

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
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={project.id} initialPresence={{ cursor: null, thinking: false }}>
        <div className="flex h-screen w-full bg-[#080809] text-zinc-100 overflow-hidden flex-col">
          <EditorNavbar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            projectName={project.name}
            hideUserButton={true}
            actions={
              <>
                <SaveButton />
                <Button variant="outline" size="sm" onClick={() => setIsTemplatesModalOpen(true)} className="border-zinc-800 bg-transparent hover:bg-zinc-800 text-zinc-300">
                  <LayoutTemplate className="mr-2 h-4 w-4" />
                  Templates
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsShareDialogOpen(true)} className="border-zinc-800 bg-transparent hover:bg-zinc-800 text-zinc-300">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                  className="bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-medium"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI
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

          <StarterTemplatesModal
            open={isTemplatesModalOpen}
            onOpenChange={setIsTemplatesModalOpen}
            onImport={(template) => {
              setIsTemplatesModalOpen(false);
              setTimeout(() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("import-template", { detail: template }));
                }
              }, 100);
            }}
          />

          <div className="relative flex-1 overflow-hidden">
            {/* Central Canvas Area - fills the entire space */}
            <main className="absolute inset-2 bg-[#111114] rounded-xl border border-zinc-800 overflow-hidden shadow-lg z-0">
              <CanvasWrapper roomId={project.id} />
            </main>

            {/* Left Sidebar */}
            <div 
              className={cn(
                "absolute top-2 bottom-2 left-2 z-10 w-64 transition-transform duration-300 ease-in-out shadow-2xl rounded-xl",
                isSidebarOpen ? "translate-x-0" : "-translate-x-[calc(100%+16px)]"
              )}
            >
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
            </div>

            {/* Right Sidebar Placeholder (AI Chat) */}
            <div 
              className={cn(
                "absolute top-2 bottom-2 right-2 z-10 w-80 transition-transform duration-300 ease-in-out shadow-2xl rounded-xl",
                isRightSidebarOpen ? "translate-x-0" : "translate-x-[calc(100%+16px)]"
              )}
            >
              <AiSidebar projectId={project.id} onClose={() => setIsRightSidebarOpen(false)} />
            </div>
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
      </RoomProvider>
    </LiveblocksProvider>
  );
}