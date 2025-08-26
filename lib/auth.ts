import { getServerSession } from 'next-auth'
import type { NextAuthOptions } from 'next-auth'

export async function getAuthSession() {
  if (process.env.AUTH_PROVIDER === 'clerk') {
    const { auth } = await import('@clerk/nextjs')
    try {
      const { userId } = auth()
      if (!userId) return null
      return { user: { id: userId } }
    } catch {
      return null
    }
  }
  const { authOptions } = await import('../app/api/auth/[...nextauth]/authOptions')
  return getServerSession(authOptions as NextAuthOptions)
}
