import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { EditorHomeClient } from './editor-home-client';
import { redirect } from 'next/navigation';

export default async function EditorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch owned projects and currentUser in parallel to speed up load time
  const myProjectsPromise = prisma.project.findMany({
    where: { ownerId: userId },
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  });

  const userPromise = currentUser();

  const [myProjects, user] = await Promise.all([myProjectsPromise, userPromise]);

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  // Fetch shared projects only if we have an email
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
