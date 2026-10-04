import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { EditorHomeClient } from './editor-home-client';
import { redirect } from 'next/navigation';

export default async function EditorPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const userEmail = user.emailAddresses[0]?.emailAddress;

  // Fetch owned projects
  const myProjects = await prisma.project.findMany({
    where: { ownerId: user.id },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch shared projects
  const sharedProjects = userEmail ? await prisma.project.findMany({
    where: {
      collaborators: {
        some: { email: userEmail }
      }
    },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  }) : [];

  return (
    <EditorHomeClient 
      myProjects={myProjects} 
      sharedProjects={sharedProjects} 
    />
  );
}
