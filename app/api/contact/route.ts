import { NextRequest, NextResponse } from 'next/server';
import { postToScript } from '@/app/lib/postToScript';

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.error('[contact] GOOGLE_SCRIPT_URL not set');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const body = await req.json();

  // Capture server-side metadata
  const ip      = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? req.headers.get('x-real-ip')
               ?? 'unknown';
  const country = req.headers.get('x-vercel-ip-country') ?? '';

  const payload = {
    type: 'contact',
    timestamp: new Date().toISOString(),
    fullName:     body.fullName   ?? '',
    role:         body.role       ?? '',
    phone:        body.phone      ?? '',
    email:        body.email      ?? '',
    company:      body.company    ?? '',
    helpWith:     body.helpWith   ?? '',
    page:         body.page       ?? '',
    referrer:     body.referrer   ?? '',
    utm_source:   body.utm_source   ?? '',
    utm_medium:   body.utm_medium   ?? '',
    utm_campaign: body.utm_campaign ?? '',
    ip,
    country,
  };

  try {
    await postToScript(scriptUrl, payload);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] script error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
