/**
 * Sends form data to the BrewMyAgent Dashboard API
 * Supports all three forms: quote, contact, and traffic tracking
 */

interface DashboardPayload {
  api_key: string;
  form_name: string;
  data: Record<string, any>;
}

export async function postToDashboard(formName: string, data: Record<string, any>): Promise<void> {
  const endpoint = process.env.NEXT_PUBLIC_DASHBOARD_ENDPOINT;
  const apiKey = process.env.NEXT_PUBLIC_DASHBOARD_API_KEY;

  if (!endpoint || !apiKey) {
    console.error('[Dashboard] Missing API credentials');
    throw new Error('Dashboard API not configured');
  }

  const payload: DashboardPayload = {
    api_key: apiKey,
    form_name: formName,
    data: {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'trident-website',
    }
  };

  try {
    console.log(`[Dashboard] Sending ${formName} data:`, payload);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Dashboard API responded with ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`[Dashboard] Successfully sent ${formName}:`, result);
    
  } catch (error) {
    console.error(`[Dashboard] Error sending ${formName}:`, error);
    throw error;
  }
}
