import Link from 'next/link'
import { Product } from '@prisma/client'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.handle}`} className="border p-2 flex flex-col">
      {product.imageUrls[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.imageUrls[0]} alt={product.title} className="w-full h-48 object-cover" />
      )}
      <h3 className="mt-2 font-semibold">{product.title}</h3>
      <p>${product.price}</p>
    </Link>
  )
}
