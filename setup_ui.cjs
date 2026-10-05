const fs = require('fs');

const workspaceClient = `"use client";

import { useState } from "react";
import { Share, MessageSquare, PanelRightClose, PanelRightOpen, Sparkles } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { Button } from "@/components/ui/button";
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

      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        <div className={\`shrink-0 transition-all duration-300 \${isSidebarOpen ? 'w-64' : 'w-0 hidden'}\`}>
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

        {/* Central Canvas Area */}
        <main className="flex-1 bg-[#141415] rounded-xl border border-zinc-800 overflow-hidden relative shadow-lg min-w-0">
          <CanvasWrapper roomId={project.id} />
        </main>

        {/* Right Sidebar Placeholder (AI Chat) */}
        {isRightSidebarOpen && (
          <aside className="w-80 shrink-0 bg-[#141415] rounded-xl border border-zinc-800 flex flex-col z-10 shadow-lg overflow-hidden">
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
`;

const homeClient = `"use client";

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
        <div className={\`shrink-0 transition-all duration-300 \${isSidebarOpen ? 'w-64' : 'w-0 hidden'}\`}>
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
`;

fs.writeFileSync('app/editor/[roomId]/editor-workspace-client.tsx', workspaceClient);
fs.writeFileSync('app/editor/editor-home-client.tsx', homeClient);
console.log('Fixed flexbox layout restored.');
