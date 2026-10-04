import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; collaboratorId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { projectId, collaboratorId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) return new NextResponse("Not Found", { status: 404 });

  if (project.ownerId !== userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    await prisma.projectCollaborator.delete({
      where: { id: collaboratorId }
    });
  } catch {
    // Already deleted or not found
  }

  return new NextResponse(null, { status: 204 });
}

