import { NextRequest, NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { projectId } = await params;
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: true }
  });

  if (!project) return new NextResponse("Not Found", { status: 404 });

  const email = user.primaryEmailAddress?.emailAddress;
  
  const isOwner = project.ownerId === user.id;
  const isCollaborator = project.collaborators.some(c => c.email === email);

  if (!isOwner && !isCollaborator) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const client = await clerkClient();
  const emails = project.collaborators.map(c => c.email);
  
  let clerkUsers: Array<{ firstName: string | null, lastName: string | null, imageUrl: string, emailAddresses: Array<{ emailAddress: string }> }> = [];
  if (emails.length > 0) {
    try {
      const { data } = await client.users.getUserList({
        emailAddress: emails
      });
      clerkUsers = data as Array<{ firstName: string | null, lastName: string | null, imageUrl: string, emailAddresses: Array<{ emailAddress: string }> }>;
    } catch (e) {
      console.error("Failed to fetch clerk users", e);
    }
  }

  const enrichedCollaborators = project.collaborators.map(c => {
    const clerkUser = clerkUsers.find(u => 
      u.emailAddresses.some(e => e.emailAddress === c.email)
    );
    
    return {
      id: c.id,
      email: c.email,
      createdAt: c.createdAt,
      displayName: clerkUser ? (clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null) : null,
      avatarImage: clerkUser?.imageUrl || null
    };
  });

  return NextResponse.json(enrichedCollaborators);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId }
  });

  if (!project) return new NextResponse("Not Found", { status: 404 });

  if (project.ownerId !== user.id) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { email } = await request.json();
  if (!email || typeof email !== 'string') {
    return new NextResponse("Bad Request", { status: 400 });
  }

  if (email === user.primaryEmailAddress?.emailAddress) {
    return new NextResponse("Cannot invite owner", { status: 400 });
  }

  try {
    const collaborator = await prisma.projectCollaborator.create({
      data: {
        projectId,
        email
      }
    });

    const client = await clerkClient();
    const { data } = await client.users.getUserList({ emailAddress: [email] });
    const clerkUser = data[0];

    const enrichedCollaborator = {
      id: collaborator.id,
      email: collaborator.email,
      createdAt: collaborator.createdAt,
      displayName: clerkUser ? (clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null) : null,
      avatarImage: clerkUser?.imageUrl || null
    };

    return NextResponse.json(enrichedCollaborator);
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2002') {
      return new NextResponse("Already a collaborator", { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
