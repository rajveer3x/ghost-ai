import { NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { tasks } from '@trigger.dev/sdk/v3';
import { checkProjectAccess } from '@/lib/project-access';
import { InputSchema } from '@/src/trigger/generate-spec-schema';

export async function POST(req: Request) {
  const { userId } = await clerkAuth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const roomId = body?.roomId;

    if (typeof roomId !== 'string' || !roomId) {
      return new NextResponse('Missing required field: roomId', { status: 400 });
    }

    // Resolve project access from roomId
    const access = await checkProjectAccess(roomId);

    if (!access.hasAccess || !access.project) {
      return new NextResponse('Project not found or unauthorized', { status: 404 });
    }

    const projectId = access.project.id;
    const parsedInput = InputSchema.safeParse({
      projectId,
      roomId,
      chatHistory: body.chatHistory,
      nodes: body.nodes,
      edges: body.edges,
    });

    if (!parsedInput.success) {
      return new NextResponse('Invalid request body', { status: 400 });
    }

    // Trigger the generate-spec task
    const run = await tasks.trigger('generate-spec', parsedInput.data);

    // Create TaskRun record for ownership/access control
    await prisma.taskRun.create({
      data: {
        runId: run.id,
        projectId,
        userId,
      },
    });

    return NextResponse.json({ runId: run.id });
  } catch (error) {
    console.error('[SPEC_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
