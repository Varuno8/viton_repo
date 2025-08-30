import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: {
    handle: string
    title: string
    brand: string | null
    price: number | null
    firstImage: string | null
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div whileHover={{ y: -4 }} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg">
      <Link href={`/products/${product.handle}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          {product.firstImage ? (
            <Image
              src={product.firstImage}
              alt={product.title}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-zinc-800 text-zinc-400">
              No image
            </div>
          )}
          {product.price !== null && (
            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              ₹{product.price}
            </span>
          )}
        </div>
        <div className="p-4 space-y-1">
          {product.brand && <p className="text-sm text-zinc-400">{product.brand}</p>}
          <h3 className="font-medium line-clamp-2">{product.title}</h3>
        </div>
      </Link>
    </motion.div>
  )
}
