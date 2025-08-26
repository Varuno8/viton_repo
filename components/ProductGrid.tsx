import { prisma } from '@/lib/prisma'
import { ProductCard } from './ProductCard'

export async function ProductGrid() {
  const products = await prisma.product.findMany({ take: 50 })
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
