// Stripe over plain fetch (no SDK) so it bundles tiny and runs on Workers.
import type { Env } from './env';

const API = 'https://api.stripe.com/v1';

function form(obj: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) p.set(k, String(v));
  return p.toString();
}

async function call(env: Env, path: string, body: string, method = 'POST'): Promise<any> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: method === 'GET' ? undefined : body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Stripe ${path} failed: ${res.status} ${JSON.stringify(data)}`);
  return data;
}

export async function createCheckoutSession(
  env: Env,
  opts: { successUrl: string; cancelUrl: string; pricePence: number; priceId?: string },
): Promise<{ id: string; url: string }> {
  const base: Record<string, string | number> = {
    mode: 'payment',
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    'line_items[0][quantity]': 1,
    'metadata[product]': 'brentford_card',
    // Ask Stripe to create/reuse a customer so we keep a stripe_customer_id.
    customer_creation: 'always',
    'payment_intent_data[description]': 'The Brentford Card — annual membership',
    'billing_address_collection': 'auto',
  };
  if (opts.priceId) {
    base['line_items[0][price]'] = opts.priceId;
  } else {
    base['line_items[0][price_data][currency]'] = 'gbp';
    base['line_items[0][price_data][unit_amount]'] = opts.pricePence;
    base['line_items[0][price_data][product_data][name]'] = 'The Brentford Card';
    base['line_items[0][price_data][product_data][description]'] =
      'Annual Brentford Card membership — Apple/Google Wallet pass';
  }
  const session = await call(env, '/checkout/sessions', form(base));
  return { id: session.id, url: session.url };
}

export async function retrieveSession(env: Env, id: string): Promise<any> {
  return call(env, `/checkout/sessions/${id}?expand[]=customer&expand[]=payment_intent`, '', 'GET');
}

// Verify a Stripe webhook signature using WebCrypto (Workers-compatible).
export async function verifyWebhook(
  payload: string,
  sigHeader: string | null,
  secret: string,
  toleranceSec = 300,
): Promise<any> {
  if (!sigHeader) throw new Error('Missing Stripe-Signature header');
  const parts = Object.fromEntries(
    sigHeader.split(',').map((kv) => {
      const [k, v] = kv.split('=');
      return [k.trim(), v];
    }),
  );
  const t = parts['t'];
  const v1 = parts['v1'];
  if (!t || !v1) throw new Error('Malformed Stripe-Signature header');

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${t}.${payload}`));
  const expected = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');

  if (!timingSafeEqual(expected, v1)) throw new Error('Signature mismatch');

  const age = Math.floor(Date.now() / 1000) - Number(t);
  if (Math.abs(age) > toleranceSec) throw new Error('Timestamp outside tolerance');

  return JSON.parse(payload);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
