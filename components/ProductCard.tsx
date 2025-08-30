'use client';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  handle: string;
  title: string;
  price?: number | null;
  firstImage?: string | null;
};

export default function ProductCard({ handle, title, price, firstImage }: Props) {
  return (
    <Link
      href={`/products/${handle}`}
      className="group rounded-2xl overflow-hidden bg-zinc-900/40 ring-1 ring-white/10 hover:ring-cyan-400/40 transition"
    >
      <div className="relative aspect-[3/4] bg-zinc-800/40 flex items-center justify-center text-zinc-400">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width:1024px) 25vw, 50vw"
            priority={false}
            unoptimized
          />
        ) : (
          <span>No image</span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <div className="text-sm text-zinc-300 line-clamp-1">{title || 'Untitled'}</div>
        {typeof price === 'number' && (
          <div className="text-xs text-zinc-400">₹{price.toFixed(2)}</div>
        )}
      </div>
    </Link>
  );
}
