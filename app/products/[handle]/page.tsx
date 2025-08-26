import { getProductByHandle } from '@/lib/products'
import { TryOnPanel } from '@/components/TryOnPanel'

interface Props { params: { handle: string } }

export default async function ProductPage({ params }: Props) {
  const product = await getProductByHandle(params.handle)
  if (!product) return <div>Not found</div>
  return (
    <div>
      <h1 className="text-xl font-bold">{product.title}</h1>
      <div className="flex gap-2 overflow-x-auto mt-2">
        {product.imageUrls.map(url => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={url} src={url} alt={product.title} className="w-48 h-48 object-cover" />
        ))}
      </div>
      {/* @ts-expect-error Client Component */}
      <TryOnPanel product={product} />
    </div>
  )
}
