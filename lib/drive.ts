export function toDirectDriveUrl(input: string): string | null {
  const match = input.match(/\/file\/d\/([^/]+)\//)
  if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`
  if (input.includes('uc?export=download')) return input
  return null
}
