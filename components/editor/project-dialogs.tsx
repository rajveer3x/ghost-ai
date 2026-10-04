"use client";

import { useState } from "react";
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
import { DialogType } from "@/hooks/use-project-dialogs";

interface ProjectDialogsProps {
  activeDialog: DialogType;
  projectId: string | null;
  projectName: string;
  onClose: () => void;
}

export function ProjectDialogs({
  activeDialog,
  projectId, // Keep for API calls later
  projectName,
  onClose,
}: ProjectDialogsProps) {
  return (
    <>
      <Dialog open={activeDialog === "create"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          {activeDialog === "create" && <CreateProjectForm onClose={onClose} />}
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "rename"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          {activeDialog === "rename" && (
            <RenameProjectForm projectName={projectName} onClose={onClose} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={activeDialog === "delete"} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <DeleteProjectForm projectId={projectId} onClose={onClose} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function CreateProjectForm({ onClose }: { onClose: () => void }) {
  const [nameInput, setNameInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slugPreview = nameInput
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
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
          />
        </div>
        <div className="text-sm text-muted-foreground flex items-center h-5">
          {nameInput && (
            <>
              <span className="mr-1">URL slug:</span>
              <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
                {slugPreview}
              </span>
            </>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!nameInput.trim() || isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function RenameProjectForm({ projectName, onClose }: { projectName: string; onClose: () => void }) {
  const [nameInput, setNameInput] = useState(projectName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || nameInput === projectName) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
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
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!nameInput.trim() || nameInput === projectName || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function DeleteProjectForm({ projectId, onClose }: { projectId: string | null; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = () => {
    if (!projectId) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this project? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="button" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
          {isSubmitting ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </>
  );
}
