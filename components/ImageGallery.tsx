'use client'
import { useState, KeyboardEvent } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  title?: string
}

export default function ImageGallery({ images, title }: Props) {
  const [index, setIndex] = useState(0)
  const current = images[index]

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setIndex(i => (i + 1) % images.length)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setIndex(i => (i - 1 + images.length) % images.length)
    }
  }

  if (!images.length) {
    return (
      <div className="flex items-center justify-center bg-zinc-800/50 rounded-lg aspect-square w-full text-zinc-400">
        No images yet
      </div>
    )
  }

  return (
    <div className="flex gap-4" onKeyDown={onKey} tabIndex={0}>
      <div className="flex flex-col gap-2">
        {images.map((img, i) => (
          <button
            key={img + i}
            onClick={() => setIndex(i)}
            className={`relative w-16 h-16 rounded-md overflow-hidden border ${i === index ? 'border-cyan-400' : 'border-white/10'}`}
          >
            <Image src={img} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative flex-1 aspect-square md:aspect-[3/4] overflow-hidden rounded-lg bg-black/20">
        <Image
          src={current}
          alt={title || ''}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  )
}
