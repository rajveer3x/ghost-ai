Add functionality to generate Infrastructure as Code (IaC) — specifically Terraform (HCL) — from the visual architecture graph using AI. 

### Implementation

1. Database Updates
- Update the Prisma schema to support storing IaC files. Either create a new `ProjectIac` model or add a `type` (e.g., `MARKDOWN` vs `TERRAFORM`) to the existing `ProjectSpec` model.
- Run `npx prisma db push` and `npx prisma generate`.

2. Trigger.dev Background Task
- Create `src/trigger/generate-iac.ts` (similar to `generate-spec.ts`).
- **The System Prompt is critical here.** Use the following instruction set for the Groq LLM:
  > "You are an expert DevOps and Cloud Infrastructure Architect. Your task is to analyze a JSON representation of a visual system architecture graph (nodes and edges) and write valid, production-ready Terraform (HCL) code for AWS to deploy this system. 
  > 
  > RULES:
  > 1. Infer the appropriate AWS resources (e.g., if you see a 'Database' node, output an aws_db_instance RDS resource. If you see a 'Service' node, output ECS or Lambda).
  > 2. Create the necessary networking components (VPC, Subnets, Security Groups) to connect these resources securely based on the edges (connections) in the graph.
  > 3. Ensure all resources are properly linked using Terraform references (e.g., `vpc_security_group_ids = [aws_security_group.app_sg.id]`).
  > 4. OUTPUT ONLY VALID TERRAFORM HCL CODE. Do not include markdown formatting, explanations, or any conversational text. Start immediately with `provider "aws" {`."
- Use the `gemini` or `groq` AI SDK integration to generate the text.
- Upload the generated string to Vercel Blob with a `.tf` extension.
- Save the Blob URL to the database.

3. API Routes
- Create `app/api/ai/iac/route.ts` to validate the user, project ownership, and trigger the Trigger.dev task.
- Create a download route `app/api/projects/[projectId]/iac/[iacId]/download/route.ts` to securely stream the `.tf` file to the client.

4. UI Integration
- Update the AI Sidebar (either in the Specs tab or a new "IaC" tab).
- Add a "Generate Terraform" button.
- Track the Trigger.dev run status using `@trigger.dev/react-hooks` (`useRealtimeRun`) just like the design and spec agents.
- Fetch and display the list of generated `.tf` files.
- Provide a button to download the code as `main.tf`.

### UI Details

- Use the existing sidebar architecture.
- For previewing the code in a modal, render it inside a `<pre><code>` block with `overflow-auto` and a dark background to simulate a code editor.
- Use a monospaced font (`--font-geist-mono`) for the code preview.

### Scope Limits

- Only target AWS as the cloud provider for the initial implementation to keep the AI prompt focused.
- Do not attempt to execute or validate the Terraform code on the server. Ghost AI's job is just to generate the starting point for the user.
- Keep the generated Terraform in a single `main.tf` structure rather than trying to generate complex multi-file modules.

### Check When Done

- Database schema supports the new asset type.
- Clicking "Generate Terraform" starts a background job and updates the UI with the loading state.
- The resulting `.tf` file can be previewed in a modal and downloaded.
- The downloaded file contains valid HCL syntax and maps logically to the nodes that were on the canvas.

