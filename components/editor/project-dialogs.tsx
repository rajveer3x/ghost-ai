"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogType } from "@/hooks/use-project-actions";

interface ProjectDialogsProps {
  activeDialog: DialogType;
  projectId: string | null;
  projectName: string;
  onClose: () => void;
  onCreateProject: (name: string) => Promise<void>;
  onRenameProject: (id: string, newName: string) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

export function ProjectDialogs({
  activeDialog,
  projectId,
  projectName,
  onClose,
  onCreateProject,
  onRenameProject,
  onDeleteProject
}: ProjectDialogsProps) {
  return (
    <>
      <Dialog open={activeDialog === "create"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-[#18181c]/95 backdrop-blur-xl border-zinc-800 text-zinc-100 rounded-3xl p-6 sm:max-w-md">
          {activeDialog === "create" && <CreateProjectForm onClose={onClose} onCreate={onCreateProject} />}
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "rename"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-[#18181c]/95 backdrop-blur-xl border-zinc-800 text-zinc-100 rounded-3xl p-6 sm:max-w-md">
          {activeDialog === "rename" && projectId && (
            <RenameProjectForm 
              projectId={projectId}
              projectName={projectName} 
              onClose={onClose} 
              onRename={onRenameProject} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "delete"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-[#18181c]/95 backdrop-blur-xl border-zinc-800 text-zinc-100 rounded-3xl p-6 sm:max-w-md">
          {activeDialog === "delete" && projectId && (
            <DeleteProjectForm 
              projectId={projectId}
              projectName={projectName} 
              onClose={onClose} 
              onDelete={onDeleteProject} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function CreateProjectForm({ onClose, onCreate }: { onClose: () => void, onCreate: (name: string) => Promise<void> }) {
  const [nameInput, setNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [randomSuffix, setRandomSuffix] = useState("a1b2c");

  useEffect(() => {
    setRandomSuffix(Math.random().toString(36).substring(2, 7));
  }, []);

  const slugPreview = nameInput
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsSubmitting(true);
    await onCreate(nameInput);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleCreate}>
      <DialogHeader>
        <DialogTitle>Create Project</DialogTitle>
        <DialogDescription>
          Create a new workspace for your architecture project.
        </DialogDescription>
      </DialogHeader>
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="project-name" className="text-sm font-medium">
            Project Name
          </label>
          <Input
            id="project-name"
            placeholder="e.g. Acme Web App"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            autoFocus
            className="bg-black/20 border-zinc-700/50 focus-visible:ring-[#00c8d4]/50 focus-visible:border-[#00c8d4]/50 rounded-xl"
          />
        </div>
        <div className="text-sm text-zinc-500 flex items-center h-5">
          {nameInput && (
            <>
              <span className="mr-2">URL slug:</span>
              <span className="font-mono bg-black/40 px-2 py-0.5 rounded-md text-zinc-300 border border-zinc-800/50">
                {slugPreview}-{randomSuffix}
              </span>
            </>
          )}
        </div>
      </div>
      <DialogFooter className="bg-transparent border-t-0 p-0 m-0 mt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-xl border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100">
          Cancel
        </Button>
        <Button type="submit" disabled={!nameInput.trim() || isSubmitting} className="bg-[#00c8d4] hover:bg-[#00c8d4]/90 text-black font-medium rounded-xl shadow-lg shadow-[#00c8d4]/10 transition-all hover:shadow-[#00c8d4]/20">
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function RenameProjectForm({ 
  projectId,
  projectName, 
  onClose,
  onRename 
}: { 
  projectId: string;
  projectName: string; 
  onClose: () => void;
  onRename: (id: string, name: string) => Promise<void>;
}) {
  const [nameInput, setNameInput] = useState(projectName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || nameInput === projectName) return;
    setIsSubmitting(true);
    await onRename(projectId, nameInput);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleRename}>
      <DialogHeader>
        <DialogTitle>Rename Project</DialogTitle>
        <DialogDescription>
          Current name: <span className="font-semibold text-foreground">{projectName}</span>
        </DialogDescription>
      </DialogHeader>
      <div className="py-6">
        <Input
          placeholder="New project name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          autoFocus
          className="bg-black/20 border-zinc-700/50 focus-visible:ring-[#00c8d4]/50 focus-visible:border-[#00c8d4]/50 rounded-xl"
        />
      </div>
      <DialogFooter className="bg-transparent border-t-0 p-0 m-0 mt-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-xl border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100">
          Cancel
        </Button>
        <Button type="submit" disabled={!nameInput.trim() || nameInput === projectName || isSubmitting} className="bg-[#00c8d4] hover:bg-[#00c8d4]/90 text-black font-medium rounded-xl shadow-lg shadow-[#00c8d4]/10 transition-all hover:shadow-[#00c8d4]/20">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function DeleteProjectForm({ 
  projectId, 
  projectName,
  onClose,
  onDelete 
}: { 
  projectId: string; 
  projectName: string;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    await onDelete(projectId);
    setIsSubmitting(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <span className="font-semibold text-foreground">{projectName}</span>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="bg-transparent border-t-0 p-0 m-0 mt-6">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="rounded-xl border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100">
          Cancel
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting} className="rounded-xl shadow-lg shadow-red-500/10 transition-all hover:shadow-red-500/20 bg-red-500/90 hover:bg-red-500 text-white font-medium">
          {isSubmitting ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </>
  );
}
