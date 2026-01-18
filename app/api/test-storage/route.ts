import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Test KV connection
    const kvTest = await kv.set('test-key', 'test-value');
    const kvGet = await kv.get('test-key');

    return NextResponse.json({
      success: true,
      kv: {
        canWrite: kvTest === 'OK',
        canRead: kvGet === 'test-value',
        value: kvGet,
      },
      env: {
        hasKvUrl: !!process.env.KV_REST_API_URL,
        hasKvToken: !!process.env.KV_REST_API_TOKEN,
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
