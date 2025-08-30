'use server'

export async function ingestAction(prevState: any, formData: FormData) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/admin/ingest`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { error: data?.error || 'Failed to ingest', count: null };
    }
    const data = await res.json();
    return { count: data.ingestedCount ?? null, error: null };
  } catch (e: any) {
    return { error: e.message, count: null };
  }
}
