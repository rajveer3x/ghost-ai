import { NextResponse } from 'next/server';
import { auth as clerkAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { checkProjectAccess } from '@/lib/project-access';
import { InputSchema } from '@/src/trigger/generate-spec-schema';
import { put } from '@vercel/blob';

export const maxDuration = 60; // Set max duration to 60s for Vercel Hobby

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

    const validatedPayload = parsedInput.data;
    
    // Build context for the AI
    const systemPrompt = `You are an expert technical writer and software architect. Your task is to generate a comprehensive, clear, and well-structured Markdown technical specification based on the provided architecture canvas and chat history.
The spec should include:
- A brief overview
- Architecture and components
- Data flow (based on nodes and edges)
- Key decisions (extracted from chat history)`;

    const promptContext = `
Canvas Nodes:
${JSON.stringify(validatedPayload.nodes, null, 2)}

Canvas Edges:
${JSON.stringify(validatedPayload.edges, null, 2)}

Chat History:
${JSON.stringify(validatedPayload.chatHistory, null, 2)}

Please generate the Markdown technical specification now.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 second timeout

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: promptContext }
        ],
        max_tokens: 4000
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      throw new Error(`Groq API Error: ${groqRes.status} ${errText}`);
    }

    const groqData = await groqRes.json();
    const markdownContent = groqData.choices[0].message.content;

    const blob = await put(`specs/${projectId}/${Date.now()}.md`, markdownContent, {
      access: 'private',
      contentType: 'text/markdown',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const spec = await prisma.projectSpec.create({
      data: {
        projectId,
        filePath: blob.url,
      }
    });

    return NextResponse.json({ success: true, specId: spec.id, blobUrl: blob.url });
  } catch (error: any) {
    console.error('[SPEC_POST]', error);
    return new NextResponse(`Internal Error: ${error.message || 'Unknown'}`, { status: 500 });
  }
}
