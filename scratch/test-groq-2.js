import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    console.log("Starting Groq generation...");
    const result = await generateObject({
      model: groq('openai/gpt-oss-120b'),
      prompt: `You are an expert system architect collaborating on a canvas. Current task: "Design a modern architecture AI web app".
Allowed node shapes: rectangle, diamond, circle, pill, cylinder, hexagon.
Allowed colors (fill): '#1F1F1F' (default/neutral), '#10233D' (blue), '#2E1938' (purple), '#331B00' (orange), '#3C1618' (red), '#3A1726' (pink), '#0F2E18' (green), '#062822' (teal).
Here is the current canvas state:
{"nodes":{},"edges":{}}

Determine what actions are needed on the canvas. You can add, update, move, or delete nodes and edges.
Space them out nicely. Default width is 150 and height is 80.
`,
      schema: z.object({
        message: z.string(),
        actions: z.array(z.discriminatedUnion('type', [
          z.object({
            type: z.literal('addNode'),
            id: z.string(),
            shape: z.enum(['rectangle', 'diamond', 'circle', 'pill', 'cylinder', 'hexagon']),
            color: z.enum(['#1F1F1F', '#10233D', '#2E1938', '#331B00', '#3C1618', '#3A1726', '#0F2E18', '#062822']).optional(),
            label: z.string(),
            x: z.number(),
            y: z.number(),
            width: z.number().default(150),
            height: z.number().default(80),
          }),
          z.object({
            type: z.literal('addEdge'),
            id: z.string(),
            source: z.string(),
            target: z.string(),
            label: z.string().optional(),
          }),
        ]))
      })
    });
    console.log("Success!");
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
