import { NextRequest, NextResponse } from 'next/server';
import { postToScript } from '@/app/lib/postToScript';

export async function POST(req: NextRequest) {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
  if (!scriptUrl) {
    console.log('[track] GOOGLE_SCRIPT_URL not configured, skipping');
    return NextResponse.json({ ok: true });
  }

  const body = await req.json();

  const ip      = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
               ?? req.headers.get('x-real-ip')
               ?? 'unknown';
  const country = req.headers.get('x-vercel-ip-country') ?? '';

  const payload = {
    type: 'traffic',
    timestamp: new Date().toISOString(),
    page:         body.page         ?? '',
    referrer:     body.referrer     ?? '',
    utm_source:   body.utm_source   ?? '',
    utm_medium:   body.utm_medium   ?? '',
    utm_campaign: body.utm_campaign ?? '',
    utm_content:  body.utm_content  ?? '',
    utm_term:     body.utm_term     ?? '',
    browser:      body.browser      ?? '',
    os:           body.os           ?? '',
    device:       body.device       ?? '',
    language:     body.language     ?? '',
    screen:       body.screen       ?? '',
    viewport:     body.viewport     ?? '',
    ip,
    country,
  };

  console.log('[track] Sending to Google Sheets:', payload);

  // Fire-and-forget — don't block the response
  postToScript(scriptUrl, payload)
    .then(() => console.log('[track] Successfully sent to Google Sheets'))
    .catch(err => console.error('[track] Error sending to Google Sheets:', err));
  
  return NextResponse.json({ ok: true });
}
