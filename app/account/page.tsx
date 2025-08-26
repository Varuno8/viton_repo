import { getAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function AccountPage() {
  const session = await getAuthSession()
  if (!session?.user) return <div>Please sign in</div>
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  return (
    <div>
      <h1 className="text-xl mb-4">Account</h1>
      <p>Email: {user?.email}</p>
      <p>Name: {user?.name}</p>
    </div>
  )
}
