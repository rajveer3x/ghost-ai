import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export type DialogType = "create" | "rename" | "delete" | null;

export function useProjectActions() {
  const router = useRouter();
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>("");

  const openCreateDialog = useCallback(() => {
    setActiveDialog("create");
    setProjectId(null);
    setProjectName("");
  }, []);

  const openRenameDialog = useCallback((id: string, currentName: string) => {
    setActiveDialog("rename");
    setProjectId(id);
    setProjectName(currentName);
  }, []);

  const openDeleteDialog = useCallback((id: string) => {
    setActiveDialog("delete");
    setProjectId(id);
  }, []);

  const closeDialogs = useCallback(() => {
    setActiveDialog(null);
  }, []);

  const createProject = async (name: string) => {
    const defaultName = name.trim() || 'Untitled Project';
    const shortSuffix = Math.random().toString(36).substring(2, 7);
    const slug = defaultName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    const roomId = `${slug}-${shortSuffix}`;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: defaultName, id: roomId }),
      });
      if (res.ok) {
        const project = await res.json();
        closeDialogs();
        router.push(`/editor/${project.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renameProject = async (id: string, newName: string) => {
    if (!newName.trim() || newName === projectName) {
      closeDialogs();
      return;
    }
    
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        closeDialogs();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        closeDialogs();
        if (window.location.pathname.includes(id)) {
          router.push("/editor");
        } else {
          router.refresh();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
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
  };
}
