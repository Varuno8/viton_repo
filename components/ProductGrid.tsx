'use client'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/products'
import { ProductCard } from './ProductCard'
import { api } from '@/lib/api'

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  useEffect(() => { api<Product[]>('/api/products').then(setProducts) }, [])
  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  )
  return (
    <div>
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Search products"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
