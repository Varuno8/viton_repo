'use client'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

interface Product {
  handle: string
  title: string
  brand: string | null
  price: number | null
  firstImage: string | null
}

interface Props {
  initialProducts: Product[]
}

export function ProductGrid({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query === '') return
    setLoading(true)
    fetch('/api/products?q=' + encodeURIComponent(query), { cache: 'no-store' })
      .then(res => res.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setProducts(data as Product[])
        else setProducts([])
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4">
          <input
            className="w-full bg-transparent outline-none placeholder-zinc-400"
            placeholder="Search products"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
              ))
            : products.map(p => <ProductCard key={p.handle} {...p} />)}
        </div>
      </div>
    </div>
  )
}
