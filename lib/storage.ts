import fs from 'fs/promises'
import path from 'path'
import { Readable } from 'stream'
import { google, drive_v3 } from 'googleapis'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'

// Determine upload provider: 'drive' (default), 's3', or 'local'
const provider = process.env.UPLOAD_PROVIDER || 'drive'
const localDir = path.join(process.cwd(), 'public', 'uploads')

let drive: drive_v3.Drive | null = null
if (provider === 'drive') {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/drive.file']
  )
  drive = google.drive({ version: 'v3', auth })
}

export async function saveBuffer(buffer: Buffer, userId: string, ext: string) {
  const filename = `${uuid()}.${ext}`

  if (provider === 's3') {
    const client = new S3Client({ region: process.env.AWS_S3_REGION })
    const Key = `${userId}/${filename}`
    await client.send(
      new PutObjectCommand({ Bucket: process.env.AWS_S3_BUCKET!, Key, Body: buffer })
    )
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${Key}`
  }

  if (provider === 'local') {
    const dir = path.join(localDir, userId)
    await fs.mkdir(dir, { recursive: true })
    const filePath = path.join(dir, filename)
    await fs.writeFile(filePath, buffer)
    return `/uploads/${userId}/${filename}`
  }

  // Default: upload to Google Drive
  if (!drive) throw new Error('Google Drive not configured')
  const fileMeta = {
    name: filename,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
  }
  const media = {
    mimeType: `image/${ext}`,
    body: Readable.from(buffer),
  }
  const res = await drive.files.create({
    requestBody: fileMeta,
    media,
    fields: 'id',
  })
  const fileId = res.data.id
  if (!fileId) throw new Error('Failed to upload to Google Drive')

  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  })
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}
