import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: `Renewal initiated for ${body.documentTitle || 'document'}`,
      renewalId: `ren-${Date.now()}`,
      status: 'Pending Authority Verification',
      estimatedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to request renewal' }, { status: 400 });
  }
}
