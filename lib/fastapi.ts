const BASE = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000';

export async function startTryOn({ 
  userPhotoUrls, 
  garmentImageUrl, 
  options 
}: {
  userPhotoUrls: string[];
  garmentImageUrl: string;
  options?: any;
}) {
  const res = await fetch(`${BASE}/try-on`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      user_photo_urls: userPhotoUrls, 
      garment_image_url: garmentImageUrl, 
      options: options || {} 
    }),
  });
  
  if (!res.ok) {
    throw new Error(`FastAPI start failed: ${res.status}`);
  }
  
  return res.json();
}

export async function getTryOn(jobId: string) {
  const res = await fetch(`${BASE}/try-on/${jobId}`);
  
  if (!res.ok) {
    throw new Error(`FastAPI status failed: ${res.status}`);
  }
  
  return res.json();
}