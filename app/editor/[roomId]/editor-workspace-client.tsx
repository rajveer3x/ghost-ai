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
    <div className="flex h-screen w-full bg-[#0E0E10] text-zinc-100 overflow-hidden flex-col">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        projectName={project.name}
        actions={
          <>
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
        <main className="absolute inset-2 bg-[#141415] rounded-xl border border-zinc-800 overflow-hidden shadow-lg z-0">
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
          <aside className="h-full w-full bg-[#141415]/95 backdrop-blur-md rounded-xl border border-zinc-800 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-zinc-800/50 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-zinc-100">AI Copilot</h3>
                <Sparkles className="h-4 w-4 text-[#00D4FF] ml-auto" />
              </div>
              <p className="text-xs text-zinc-500">Placeholder panel</p>
            </div>
            
            <div className="flex-1 p-4 flex flex-col gap-4">
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200 mb-1">Chat surface pending</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      The toggle is wired. Messaging and generation are intentionally out of scope here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 mt-auto">
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Future Hooks</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Prompt composer, run status, and architecture guidance will attach to this sidebar.
                </p>
              </div>
            </div>
          </aside>
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
  );
}