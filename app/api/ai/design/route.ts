import { NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { auth as triggerAuth, tasks } from '@trigger.dev/sdk/v3';

export async function POST(req: Request) {
  const { userId } = await clerkAuth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { prompt, roomId, projectId } = body;

    if (!prompt || !roomId || !projectId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      return new NextResponse('Project not found or unauthorized', { status: 404 });
    }

    // Trigger the design task
    const run = await tasks.trigger('design-agent', { prompt, roomId });

    // Create TaskRun record
    await prisma.taskRun.create({
      data: {
        runId: run.id,
        projectId,
        userId,
      },
    });

    const publicToken = await triggerAuth.createPublicToken({
      scopes: {
        read: {
          runs: [run.id],
        },
      },
    });

    return NextResponse.json({ runId: run.id, publicToken });
  } catch (error) {
    console.error('[DESIGN_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
