/**
 * Sends a JSON payload to a Google Apps Script web app.
 * GAS web apps redirect HTTP→HTTPS with a 301. Using redirect:'follow'
 * preserves the POST body through the redirect in Node fetch.
 */
export async function postToScript(url: string, payload: object): Promise<void> {
  const res = await fetch(url, {
    method:   'POST',
    headers:  { 'Content-Type': 'text/plain' }, // avoids CORS preflight on GAS
    body:     JSON.stringify(payload),
    redirect: 'follow',
  });
  if (!res.ok) {
    throw new Error(`GAS responded ${res.status}`);
  }
}
