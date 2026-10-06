import { NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { auth as triggerAuth, tasks } from '@trigger.dev/sdk/v3';
import { checkProjectAccess } from '@/lib/project-access';

export async function POST(req: Request) {
  const { userId } = await clerkAuth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { prompt, roomId, projectId } = body;

    if (!prompt || !roomId || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Resolve project access from roomId
    const access = await checkProjectAccess(roomId);

    if (!access.hasAccess || !access.project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
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
  } catch (error: any) {
    console.error('[DESIGN_POST]', error);
    return NextResponse.json({ error: error?.message || 'Internal Error' }, { status: 500 });
  }
}
