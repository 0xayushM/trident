import { NextRequest, NextResponse } from 'next/server';
import { postToScript } from '@/app/lib/postToScript';

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.error('[quote] GOOGLE_SCRIPT_URL not set');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const body = await req.json();

  const ip      = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? req.headers.get('x-real-ip')
               ?? 'unknown';
  const country = req.headers.get('x-vercel-ip-country') ?? '';

  const payload = {
    type: 'quote',
    timestamp: new Date().toISOString(),
    fullName:     body.fullName     ?? '',
    email:        body.email        ?? '',
    phone:        body.phone        ?? '',
    whatToSource: body.whatToSource ?? '',
    destination:  body.destination  ?? '',
    page:         body.page         ?? '',
    referrer:     body.referrer     ?? '',
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
    console.error('[quote] script error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
