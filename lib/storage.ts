import fs from 'fs/promises'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'

const useS3 = process.env.USE_S3 === 'true'
const localDir = path.join(process.cwd(), 'public', 'uploads')

export async function saveBuffer(buffer: Buffer, userId: string, ext: string) {
  const filename = `${uuid()}.${ext}`
  if (useS3) {
    const client = new S3Client({ region: process.env.AWS_S3_REGION })
    const Key = `${userId}/${filename}`
    await client.send(new PutObjectCommand({ Bucket: process.env.AWS_S3_BUCKET!, Key, Body: buffer }))
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${Key}`
  } else {
    const dir = path.join(localDir, userId)
    await fs.mkdir(dir, { recursive: true })
    const filePath = path.join(dir, filename)
    await fs.writeFile(filePath, buffer)
    return `/uploads/${userId}/${filename}`
  }
}
