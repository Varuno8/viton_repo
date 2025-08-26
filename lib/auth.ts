import { auth } from '@clerk/nextjs/server'

export async function getAuthSession() {
  const { userId } = auth()
  if (!userId) return null
  return { user: { id: userId } }
}
