# Ghost AI 👻

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Trigger.dev](https://img.shields.io/badge/Trigger.dev-v3-blue)](https://trigger.dev/)
[![Liveblocks](https://img.shields.io/badge/Liveblocks-Realtime-red)](https://liveblocks.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6c47ff)](https://clerk.com/)
[![React Flow](https://img.shields.io/badge/React_Flow-Nodes-ff0072)](https://reactflow.dev/)

Ghost AI is a real-time collaborative system design workspace powered by AI. Seamlessly bridge the gap between idea and architecture: describe your system in plain English, and watch as an autonomous AI agent maps it out onto a shared, interactive canvas. Collaborate in real-time with your team to refine the design, and instantly generate a comprehensive Markdown technical specification from your resulting architecture graph.

## ✨ Features

- **🤖 AI-Powered Architecture Generation**: Describe your desired system architecture in natural language, and let Ghost AI (powered by Trigger.dev and Groq) automatically generate and wire up the nodes and edges on your canvas.
- **⚡ Real-Time Collaborative Canvas**: Work alongside your team in a shared workspace powered by Liveblocks and React Flow. Enjoy live cursors, presence indicators, real-time node/edge editing, and custom styling.
- **📚 Starter Templates Library**: Kickstart your design process with a curated library of prebuilt system design templates (e.g., monolith, microservices, event-driven, serverless) that can be imported instantly.
- **📄 Automated Spec Generation**: Instantly convert your visual canvas graph into a detailed, persistent Markdown technical specification document, ready to be reviewed or downloaded.
- **🔐 Secure Authentication & Workspaces**: Robust sign-in and route protection powered by Clerk, including project ownership and granular collaborator access controls.
- **💾 Durable State & Storage**: Project metadata is securely stored in PostgreSQL (via Prisma), while canvas snapshots and generated Markdown specs are durably persisted in Vercel Blob.

## 🛠 Tech Stack

Ghost AI is built on a modern, robust, and scalable tech stack:

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling & UI**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk
- **Database**: PostgreSQL (via Prisma ORM)
- **Real-Time Collaboration**: Liveblocks + React Flow
- **Background Jobs**: Trigger.dev (v3)
- **AI Integrations**: Vercel AI SDK + Groq
- **Artifact Storage**: Vercel Blob
- **Deployment**: Vercel (Frontend & Serverless Functions)

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

You will need accounts for the following services to obtain the required API keys:
- [Clerk](https://clerk.com/) (Authentication)
- [Liveblocks](https://liveblocks.io/) (Real-time collaboration)
- [Trigger.dev](https://trigger.dev/) (Background task execution)
- [Groq](https://groq.com/) (LLM Provider for fast inference)
- [Vercel](https://vercel.com/) (PostgreSQL Database & Blob Storage)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/ghost-ai.git
cd ghost-ai
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory and configure it with your API keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/editor
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/editor

# Database (Prisma / Vercel Postgres)
DATABASE_URL="postgres://..."

# Liveblocks (Real-time sync)
LIVEBLOCK_API_KEY=pk_dev_...
LIVEBLOCK_SECRET_KEY=sk_dev_...

# Vercel Blob (Artifact Storage)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Trigger.dev (Background Jobs)
TRIGGER_PROJECT_REF="proj_..."
TRIGGER_SECRET_KEY="tr_dev_..."

# Groq (AI Provider)
GROQ_API_KEY=gsk_...
```

### 3. Database Setup

Push the Prisma schema to your PostgreSQL database and generate the Prisma client:

```bash
npx prisma db push
npx prisma generate
```

### 4. Run the Development Servers

Ghost AI relies on the Next.js frontend and the Trigger.dev background worker running simultaneously.

**Terminal 1 (Trigger.dev Worker):**
```bash
npx trigger.dev dev
# or if using a custom package.json script
npm run trigger
```

**Terminal 2 (Next.js App):**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start building your architectures!

## ☁️ Deployment

Ghost AI is designed to be easily deployed on **Vercel** with **Trigger.dev Cloud** managing background tasks.

1. **Deploy Frontend:** Push your repository to GitHub and import it into Vercel. Ensure all production environment variables are properly set in the Vercel dashboard.
2. **Deploy Background Tasks:** Deploy your AI generation workflows to Trigger.dev Cloud:
   ```bash
   npx trigger.dev deploy
   ```
   *(Note: Ensure your production environment variables are also configured in the Trigger.dev dashboard.)*

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you'd like to improve Ghost AI.

## 📜 License

This project is licensed under the MIT License.
