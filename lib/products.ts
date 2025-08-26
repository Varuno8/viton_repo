import fs from 'fs/promises'
import path from 'path'

export interface Product {
  id: string
  handle: string
  title: string
  description: string
  brand: string
  category: string
  price: number
  colors: string[]
  sizes: string[]
  imageUrls: string[]
}

const dataFile = path.join(process.cwd(), '.data', 'products.json')

export async function getProducts(): Promise<Product[]> {
  const json = await fs.readFile(dataFile, 'utf8').catch(() => '[]')
  return JSON.parse(json)
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const products = await getProducts()
  return products.find(p => p.handle === handle)
}

export async function saveProducts(products: Product[]): Promise<void> {
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(products, null, 2))
}
