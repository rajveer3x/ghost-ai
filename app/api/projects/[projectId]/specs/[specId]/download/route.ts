import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; specId: string }> }
) {
  try {
    const { projectId, specId } = await params;
    
    const access = await checkProjectAccess(projectId);
    
    if (!access.hasAccess) {
      if (access.reason === 'not_found') {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const spec = await prisma.projectSpec.findUnique({
      where: { id: specId },
    });

    if (!spec || spec.projectId !== projectId) {
      return NextResponse.json({ error: "Spec not found" }, { status: 404 });
    }

    // Fetch from Vercel Blob
    const res = await fetch(spec.filePath, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to read spec file" }, { status: 500 });
    }

    const markdown = await res.text();

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="spec-${specId}.md"`,
      },
    });

  } catch (error) {
    console.error("[SPEC_DOWNLOAD]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
