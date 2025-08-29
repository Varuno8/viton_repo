import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { splitPipe } from '@/lib/helpers'
import ImageGallery from '@/components/ImageGallery'
import { TryOnPanel } from '@/components/TryOnPanel'

interface Props { params: { handle: string } }

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { handle: params.handle } })
  if (!product) return <div className="p-8 text-white">Not found</div>

  const images = splitPipe(product.imageUrls)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* @ts-expect-error Client Component */}
        <ImageGallery images={images} title={product.title} />
        <div className="space-y-4 md:sticky top-8 self-start">
          <p className="text-sm text-zinc-400">{product.brand}</p>
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          {product.price && <p className="text-xl font-medium">${product.price}</p>}
          {product.productUrl && (
            <Link href={product.productUrl} target="_blank" className="text-cyan-400 hover:underline">
              View on site
            </Link>
          )}
          {product.color && <p className="text-zinc-400">Color: {product.color}</p>}
          {product.pattern && <p className="text-zinc-400">Pattern: {product.pattern}</p>}
          {/* @ts-expect-error Client Component */}
          <TryOnPanel productId={product.id} />
        </div>
      </div>
    </div>
  )
}
