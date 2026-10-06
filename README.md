# Ghost AI 👻

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)](https://nextjs.org/)
[![Trigger.dev](https://img.shields.io/badge/Trigger.dev-v3-blue)](https://trigger.dev/)
[![Liveblocks](https://img.shields.io/badge/Liveblocks-Realtime-red)](https://liveblocks.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6c47ff)](https://clerk.com/)

Ghost AI is a real-time collaborative system design workspace. Describe a system architecture in plain English, and an AI agent maps that system onto a shared canvas. Collaborators can refine the architecture together in real-time, and finally, the app generates a complete technical specification Markdown document from the resulting graph.

## ✨ Features

- **Authentication & Authorization**: Secure sign-in and route protection using Clerk. Project ownership and collaborator access controls.
- **Collaborative Canvas**: Real-time shared canvas powered by Liveblocks and React Flow. Features live cursors, presence indicators, node/edge editing, and custom styling.
- **AI Architecture Generation**: Describe your system, and a background AI agent (powered by Trigger.dev and Groq) will automatically generate and wire up nodes and edges in the shared canvas.
- **Starter Templates**: Curated library of prebuilt system design templates (monolith, microservices, event-driven, etc.) that can be imported instantly.
- **AI Spec Generation**: Convert your visual canvas graph into a detailed, persistent Markdown technical specification.
- **Persistent Storage**: Project metadata in PostgreSQL (via Prisma), and canvas snapshots/Markdown specs stored durably in Vercel Blob.

## 🛠 Tech Stack

- **Framework**: Next.js 16 + TypeScript
- **UI Components**: Tailwind CSS + shadcn/ui
- **Authentication**: Clerk
- **Database**: PostgreSQL (via Prisma ORM)
- **Real-time Canvas**: Liveblocks + React Flow
- **Background Jobs**: Trigger.dev (v3)
- **AI Integrations**: Vercel AI SDK + Groq
- **Artifact Storage**: Vercel Blob

## 🚀 Getting Started

### Prerequisites

You will need accounts for the following services to get your API keys:
- [Clerk](https://clerk.com/) (Authentication)
- [Liveblocks](https://liveblocks.io/) (Real-time collaboration)
- [Trigger.dev](https://trigger.dev/) (Background tasks)
- [Groq](https://groq.com/) (LLM Provider)
- [Vercel](https://vercel.com/) (Postgres DB & Blob Storage)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/ghost-ai.git
cd ghost-ai
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory and add your API keys:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/editor
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/editor

# Database (Prisma / Vercel Postgres)
DATABASE_URL="postgres://..."

# Liveblocks
LIVEBLOCK_API_KEY=pk_dev_...
LIVEBLOCK_SECRET_KEY=sk_dev_...

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Trigger.dev
TRIGGER_PROJECT_REF="proj_..."
TRIGGER_SECRET_KEY="tr_dev_..."

# Groq AI
GROQ_API_KEY=gsk_...
```

### 3. Database Setup

Push the Prisma schema to your PostgreSQL database and generate the client:

```bash
npx prisma db push
npx prisma generate
```

### 4. Run the Development Servers

You need to run both the Next.js frontend and the Trigger.dev background worker.

**Terminal 1 (Trigger.dev Worker):**
```bash
npm run trigger
```

**Terminal 2 (Next.js App):**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment

Ghost AI is designed to be deployed on **Vercel** with **Trigger.dev Cloud** handling the background tasks.

1. Deploy the Next.js app to Vercel and ensure all production environment variables are set.
2. Deploy the background tasks to Trigger.dev Cloud:
   ```bash
   npx trigger.dev deploy
   ```
   *(Ensure your production environment variables are also provided in the Trigger.dev dashboard.)*

## 📜 License

MIT License
