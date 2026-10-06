import { NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { auth as triggerAuth } from '@trigger.dev/sdk/v3';

export async function POST(req: Request) {
  const { userId } = await clerkAuth();

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await req.json();
    const { runId } = body;

    if (!runId) {
      return new NextResponse('Missing runId', { status: 400 });
    }

    // Verify ownership
    const taskRun = await prisma.taskRun.findUnique({
      where: {
        runId,
      },
    });

    if (!taskRun || taskRun.userId !== userId) {
      return new NextResponse('Unauthorized or run not found', { status: 403 });
    }

    // Generate token
    const token = await triggerAuth.createPublicToken({
      scopes: {
        read: {
          runs: [runId],
        },
      },
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('[DESIGN_TOKEN_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
