import { NextResponse } from 'next/server';

export async function GET() {
  const adminPassword = process.env.ADMIN_PASSWORD || 'keramik2024';
  return NextResponse.json({
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    adminPasswordLength: adminPassword.length,
    adminPasswordPreview: adminPassword.substring(0, 3) + '***',
    hasSwishNumber: !!process.env.NEXT_PUBLIC_SWISH_NUMBER,
    nodeEnv: process.env.NODE_ENV,
    // Test comparison
    testKeramik2026: adminPassword === 'keramik2026',
    testKeramik2024: adminPassword === 'keramik2024',
  });
}
