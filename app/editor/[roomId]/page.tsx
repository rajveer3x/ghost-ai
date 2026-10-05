import { redirect } from "next/navigation";
import { checkProjectAccess } from "@/lib/project-access";
import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspaceClient } from "./editor-workspace-client";
import { prisma } from "@/lib/prisma";

interface EditorWorkspacePageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function EditorWorkspacePage({ params }: EditorWorkspacePageProps) {
  const { roomId } = await params;

  const access = await checkProjectAccess(roomId);

  if (access.reason === "unauthenticated") {
    redirect("/sign-in");
  }

  if (!access.hasAccess || !access.project) {
    return <AccessDenied />;
  }

  const identity = access.identity!;

  // Fetch all projects for the sidebar in parallel
  const myProjectsPromise = prisma.project.findMany({
    where: { ownerId: identity.userId },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  });

  const sharedProjectsPromise = identity.email ? prisma.project.findMany({
    where: {
      collaborators: {
        some: { email: identity.email }
      }
    },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  }) : Promise.resolve([]);

  const [myProjects, sharedProjects] = await Promise.all([myProjectsPromise, sharedProjectsPromise]);

  return (
    <EditorWorkspaceClient
      project={access.project}
      myProjects={myProjects}
      sharedProjects={sharedProjects}
      isOwner={access.project.ownerId === identity.userId}
    />
  );
}
