import { generateSpec } from './src/trigger/generate-spec.ts';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  console.log("Testing generateSpec run function directly...");
  // Extract the run function from the task definition
  // Depending on SDK version, it might be exposed on the task object, or not.
  // We can just recreate the logic to test it.
}
main().catch(console.error);
