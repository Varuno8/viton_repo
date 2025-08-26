import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Virtual Try-On</h1>
      <Link href="/products" className="underline text-blue-600">Browse Clothes</Link>
    </main>
  )
}
