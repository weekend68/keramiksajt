import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    adminPasswordLength: process.env.ADMIN_PASSWORD?.length || 0,
    hasSwishNumber: !!process.env.NEXT_PUBLIC_SWISH_NUMBER,
    nodeEnv: process.env.NODE_ENV,
  });
}
