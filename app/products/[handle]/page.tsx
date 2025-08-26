import { prisma } from '@/lib/prisma'
import { TryOnPanel } from '@/components/TryOnPanel'

interface Props { params: { handle: string } }

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { handle: params.handle } })
  if (!product) return <div>Not found</div>
  return (
    <div>
      <h1 className="text-xl font-bold">{product.title}</h1>
      {product.imageUrls[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.imageUrls[0]} alt={product.title} className="w-full h-80 object-cover" />
      )}
      {/* @ts-expect-error Client Component */}
      <TryOnPanel productId={product.id} />
    </div>
  )
}
