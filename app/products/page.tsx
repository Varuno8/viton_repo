import { ProductGrid } from '@/components/ProductGrid'

export const revalidate = 0

export default async function ProductsPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${base}/api/products`, { cache: 'no-store' })
  const products = await res.json()
  return <ProductGrid initialProducts={Array.isArray(products) ? products : []} />
}
