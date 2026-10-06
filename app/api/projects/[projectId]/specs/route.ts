import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    
    const access = await checkProjectAccess(projectId);
    
    if (!access.hasAccess) {
      if (access.reason === 'not_found') {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const specs = await prisma.projectSpec.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        filePath: true, // We will use part of it or just ID for filename
      }
    });

    return NextResponse.json(specs);

  } catch (error) {
    console.error("[SPECS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
