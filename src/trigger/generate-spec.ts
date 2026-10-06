import { logger, task, metadata } from "@trigger.dev/sdk/v3";
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { InputSchema } from './generate-spec-schema';

export const generateSpec = task({
  id: "generate-spec",
  retry: {
    maxAttempts: 1,
  },
  run: async (payload: {
    projectId: string;
    roomId: string;
    chatHistory: unknown[];
    nodes: unknown[];
    edges: unknown[];
  }) => {
    logger.log("Running generate-spec task", { projectId: payload.projectId, roomId: payload.roomId });
    metadata.set("status", "validating");

    const validatedPayload = InputSchema.parse(payload);

    try {
      metadata.set("status", "generating");
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

      logger.log("Before generateText");
      console.log("Before generateText, context length:", promptContext.length);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
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
        
        logger.log("After generateText", { textLength: markdownContent.length });
        console.log("After generateText", { textLength: markdownContent.length });
        
        metadata.set("status", "uploading");
        logger.log("Before Vercel blob put");
      console.log("Before Vercel blob put");

      const blob = await put(`specs/${validatedPayload.projectId}/${Date.now()}.md`, markdownContent, {
        access: 'private',
        contentType: 'text/markdown',
        addRandomSuffix: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      logger.log("After Vercel blob put", { url: blob.url });
      console.log("After Vercel blob put");
      
      metadata.set("status", "saving");
      logger.log("Before prisma.projectSpec.create");
      console.log("Before prisma.projectSpec.create");

      // Restore Prisma call now that prismaExtension is configured
      const spec = await prisma.projectSpec.create({
        data: {
          projectId: validatedPayload.projectId,
          filePath: blob.url,
        }
      });
      
      logger.log("After prisma.projectSpec.create", { specId: spec.id });
      console.log("After prisma.projectSpec.create", { specId: spec.id });

      metadata.set("status", "completed");

      // Return generated spec content as task output
      return { content: markdownContent, specId: spec.id, blobUrl: blob.url };
    } catch (error) {
      logger.error("Spec generation failed", { error });
      metadata.set("status", "failed");
      throw error;
    }
  },
});
