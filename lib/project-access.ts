import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function checkProjectAccess(projectId: string) {
  const { userId } = await auth();
  if (!userId) {
    return { hasAccess: false, reason: 'unauthenticated' as const };
  }

  // Run DB query in parallel with Clerk API call to significantly reduce load time
  const projectPromise = prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: true,
    },
  });

  const userPromise = currentUser();

  const [project, user] = await Promise.all([projectPromise, userPromise]);

  if (!project) {
    return { hasAccess: false, reason: 'not_found' as const };
  }

  const email = user?.emailAddresses.find(
    (e) => e.id === user?.primaryEmailAddressId
  )?.emailAddress;

  const isOwner = project.ownerId === userId;
  const isCollaborator = email ? project.collaborators.some((c) => c.email === email) : false;

  if (isOwner || isCollaborator) {
    return { hasAccess: true, project, identity: { userId, email } };
  }

  return { hasAccess: false, reason: 'unauthorized' as const };
}
