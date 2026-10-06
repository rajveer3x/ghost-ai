import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const result = await generateText({
    model: groq('llama-3.1-70b-versatile'),
    system: 'You are a test agent.',
    prompt: 'Say hello!',
  });
  console.log(result.text);
}
main().catch(console.error);
