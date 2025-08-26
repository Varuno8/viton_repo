import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';

export async function getAuthSession() {
  const { userId } = auth();
  if (!userId) return null;
  
  // Ensure user exists in our database
  let user = await prisma.user.findUnique({
    where: { clerkUserId: userId }
  });
  
  if (!user) {
    // Create user if doesn't exist
    const clerkUser = await import('@clerk/nextjs/server').then(m => m.currentUser());
    user = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || '',
        name: clerkUser?.fullName || clerkUser?.firstName || '',
      }
    });
  }
  
  return { user };
}