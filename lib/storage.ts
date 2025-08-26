import fs from 'fs/promises';
import path from 'path';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const useS3 = process.env.USE_S3 === 'true';
const localDir = path.join(process.cwd(), 'public', 'uploads');

export async function saveBuffer(buffer: Buffer, userId: string, ext: string): Promise<string> {
  const filename = `${uuid()}.${ext}`;
  
  if (useS3) {
    const s3 = new S3({
      region: process.env.AWS_S3_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    
    const Key = `${userId}/${filename}`;
    await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key,
      Body: buffer,
      ContentType: `image/${ext}`,
    }).promise();
    
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${Key}`;
  } else {
    const dir = path.join(localDir, userId);
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    await fs.writeFile(filePath, buffer);
    
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${userId}/${filename}`;
  }
}