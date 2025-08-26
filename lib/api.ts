export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error('API error')
  return res.json() as Promise<T>
}
