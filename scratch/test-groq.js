import { generateObject } from 'ai';
import { groq } from '@ai-sdk/groq';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    const result = await generateObject({
      model: groq('llama-3.1-70b-versatile'),
      prompt: "Hello",
      schema: z.object({ message: z.string() })
    });
    console.log("Success:", result.object);
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
