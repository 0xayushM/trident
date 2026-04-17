# Dashboard Integration Setup Guide

## Overview
All three forms now send data to the BrewMyAgent Dashboard API:
- **QuotePopup** - "quote" form (dialog box)
- **Contact** - "contact" form (main contact section)
- **TrafficTracker** - "traffic" form (user tracking)

## Configuration Added
Environment variables in `.env.local`:
```
NEXT_PUBLIC_DASHBOARD_PROJECT_ID=b54993f8-663d-40af-b223-c3b45bcbd088
NEXT_PUBLIC_DASHBOARD_API_KEY=b6caee56-4486-415d-8ca2-4cb57e28adf3
NEXT_PUBLIC_DASHBOARD_ENDPOINT=https://dashboard.brewmyagent.com/api/submit/b54993f8-663d-40af-b223-c3b45bcbd088
```

## Testing Instructions

### 1. QuotePopup Form (Dialog Box)
**How to trigger:**
- Wait 5 seconds after page load (auto-popup)
- OR click "Start A Conversation" button in Footer

**Data sent:**
```json
{
  "fullName": "",
  "email": "",
  "phone": "",
  "whatToSource": "",
  "destination": "",
  "page": "current URL",
  "referrer": "",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "timestamp": "ISO timestamp",
  "source": "trident-website"
}
```

### 2. Contact Form
**How to trigger:**
- Scroll to Contact section
- Fill out and submit the form

**Data sent:**
```json
{
  "fullName": "",
  "role": "",
  "phone": "",
  "email": "",
  "company": "",
  "helpWith": "",
  "page": "current URL",
  "referrer": "",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "timestamp": "ISO timestamp",
  "source": "trident-website"
}
```

### 3. Traffic Tracker
**How to trigger:**
- Automatically on page load (once per session)
- Clear session storage to re-trigger

**Data sent:**
```json
{
  "page": "current URL",
  "referrer": "",
  "utm_source": "",
  "utm_medium": "",
  "utm_campaign": "",
  "utm_content": "",
  "utm_term": "",
  "browser": "",
  "os": "",
  "device": "",
  "language": "",
  "screen": "",
  "viewport": "",
  "timestamp": "ISO timestamp",
  "source": "trident-website"
}
```

## Console Logs
Check browser console for these log messages:
- `[QuotePopup] Dashboard error:` (if error occurs)
- `[Contact] Dashboard error:` (if error occurs)
- `[TrafficTracker] Dashboard error:` (if error occurs)
- `[Dashboard] Sending [form_name] data:` (successful send)
- `[Dashboard] Successfully sent [form_name]:` (success confirmation)

## Server Logs
The dashboard API calls are made client-side, so check the browser network tab for:
- POST requests to `https://dashboard.brewmyagent.com/api/submit/b54993f8-663d-40af-b223-c3b45bcbd088`
- Response status: 200 (success) or error codes

## Troubleshooting

### If forms don't submit:
1. Check browser console for error messages
2. Verify environment variables are set correctly
3. Check network tab for failed API requests

### If popup doesn't appear:
1. Clear session storage: `trident_quote_shown`
2. Wait 5 seconds after page load
3. Check console for `[QuotePopup]` messages

### If traffic tracker doesn't fire:
1. Clear session storage: `trident_tracked`
2. Refresh the page
3. Check console for `[TrafficTracker]` messages

## Dashboard Access
Visit: https://dashboard.brewmyagent.com/
Login with your credentials to view submitted data.
