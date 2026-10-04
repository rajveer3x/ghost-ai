import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { projectId } = await params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse('Not Found', { status: 404 });
    }

    if (project.ownerId !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    if (!body.name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { name: body.name },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('[PROJECT_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { projectId } = await params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse('Not Found', { status: 404 });
    }

    if (project.ownerId !== userId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[PROJECT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
