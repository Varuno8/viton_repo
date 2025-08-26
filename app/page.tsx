import Link from 'next/link'

export default function Home() {
  return (
    <section className="text-center py-32 space-y-6">
      <h1 className="text-5xl font-extrabold tracking-tight">See outfits on you—before you buy.</h1>
      <p className="text-lg text-zinc-400">Upload your photos, try on any garment, and shop with confidence.</p>
      <div className="flex justify-center gap-4">
        <Link href="/products" className="px-6 py-3 rounded-2xl bg-accent text-black text-sm">Browse Clothes</Link>
        <Link href="/sign-in" className="px-6 py-3 rounded-2xl border border-white/20 text-sm">Sign in to Try On</Link>
      </div>
    </section>
  )
}
