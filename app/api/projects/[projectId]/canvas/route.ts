import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: { collaborators: true }
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();

    const blob = await put(`projects/${projectId}/canvas.json`, JSON.stringify(body), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    await prisma.project.update({
      where: { id: projectId },
      data: { canvasJsonPath: blob.url },
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error("[CANVAS_PUT]", error);
    return NextResponse.json({ error: "Internal Error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!project.canvasJsonPath) {
      return NextResponse.json({ nodes: [], edges: [] });
    }

    const res = await fetch(project.canvasJsonPath, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
      }
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch canvas data" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[CANVAS_GET]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
