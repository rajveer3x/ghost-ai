import { useState, useCallback } from "react";

export type DialogType = "create" | "rename" | "delete" | null;

export function useProjectDialogs() {
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

  return {
    activeDialog,
    projectId,
    projectName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
  };
}
