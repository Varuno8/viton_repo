import { ProductGrid } from '@/components/ProductGrid'

export default function ProductsPage() {
  return (
    <div>
      <h1 className="text-xl mb-4">Products</h1>
      {/* @ts-expect-error Async Server Component */}
      <ProductGrid />
    </div>
  )
}
