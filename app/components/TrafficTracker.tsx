'use client';

import { useEffect } from 'react';

/** Parses user-agent string into browser / OS / device strings */
function parseUA(ua: string): { browser: string; os: string; device: string } {
  const browser =
    /Edg\//.test(ua)    ? 'Edge' :
    /OPR\//.test(ua)    ? 'Opera' :
    /Chrome\//.test(ua) ? 'Chrome' :
    /Firefox\//.test(ua)? 'Firefox' :
    /Safari\//.test(ua) ? 'Safari' :
    'Other';

  const os =
    /Windows NT/.test(ua) ? 'Windows' :
    /Mac OS X/.test(ua)   ? 'macOS' :
    /iPhone/.test(ua)     ? 'iOS' :
    /iPad/.test(ua)       ? 'iPadOS' :
    /Android/.test(ua)    ? 'Android' :
    /Linux/.test(ua)      ? 'Linux' :
    'Other';

  const device =
    /Mobile/.test(ua)  ? 'Mobile' :
    /Tablet/.test(ua)  ? 'Tablet' :
    /iPad/.test(ua)    ? 'Tablet' :
    'Desktop';

  return { browser, os, device };
}

const TRACK_KEY = 'trident_tracked';

export default function TrafficTracker() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Only track once per session
    if (sessionStorage.getItem(TRACK_KEY)) {
      console.log('[TrafficTracker] Already tracked this session');
      return;
    }
    sessionStorage.setItem(TRACK_KEY, '1');

    const params     = new URLSearchParams(window.location.search);
    const ua         = navigator.userAgent;
    const { browser, os, device } = parseUA(ua);

    const payload = {
      page:         window.location.href,
      referrer:     document.referrer,
      utm_source:   params.get('utm_source')   ?? '',
      utm_medium:   params.get('utm_medium')   ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
      utm_content:  params.get('utm_content')  ?? '',
      utm_term:     params.get('utm_term')     ?? '',
      browser,
      os,
      device,
      language:     navigator.language,
      screen:       `${screen.width}×${screen.height}`,
      viewport:     `${window.innerWidth}×${window.innerHeight}`,
    };

    console.log('[TrafficTracker] Sending payload:', payload);

    // Fire-and-forget
    fetch('/api/track', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
      .then(res => {
        console.log('[TrafficTracker] Response:', res.status, res.ok);
        return res.json();
      })
      .then(data => console.log('[TrafficTracker] Response data:', data))
      .catch(err => console.error('[TrafficTracker] Error:', err));
  }, []);

  return null; // no UI
}
