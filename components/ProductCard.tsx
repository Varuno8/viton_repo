import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@prisma/client'
import { motion } from 'framer-motion'

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/20 shadow-lg/10">
      <Link href={`/products/${product.handle}`}> 
        <div className="relative aspect-[3/4]">
          <Image src={product.imageUrls[0]} alt={product.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-300 hover:scale-105" />
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">${product.price}</span>
        </div>
        <div className="p-4 space-y-1">
          <p className="text-sm text-zinc-400">{product.brand}</p>
          <h3 className="font-medium">{product.title}</h3>
        </div>
      </Link>
    </motion.div>
  )
}
