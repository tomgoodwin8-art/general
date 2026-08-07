// Stripe helpers via REST (no SDK — keeps the Worker bundle tiny). Server-side.
import type { Env } from './env';

const API = 'https://api.stripe.com/v1';

function form(params: Record<string, string | number | undefined>): string {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined) body.append(k, String(v));
  return body.toString();
}

export async function createPaymentIntent(
  env: Env,
  args: { amount: number; currency: string; bookingId: string; email: string; description: string }
): Promise<{ id: string; client_secret: string }> {
  if (!env.STRIPE_SECRET_KEY) throw new Error('Stripe not configured');
  const res = await fetch(`${API}/payment_intents`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form({
      amount: args.amount, // pence
      currency: args.currency,
      description: args.description,
      receipt_email: args.email,
      'metadata[bookingId]': args.bookingId,
      'automatic_payment_methods[enabled]': 'true',
    }),
  });
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${await res.text()}`);
  return (await res.json()) as { id: string; client_secret: string };
}

export async function cancelPaymentIntent(env: Env, id: string): Promise<void> {
  if (!env.STRIPE_SECRET_KEY) return;
  await fetch(`${API}/payment_intents/${id}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
}

/**
 * Verify a Stripe webhook signature (v1 scheme) using Web Crypto. Returns the
 * parsed event when valid, throws otherwise. Idempotency is the caller's job.
 */
export async function constructEvent(payload: string, sigHeader: string, secret: string, toleranceSec = 300) {
  const parts = Object.fromEntries(
    sigHeader.split(',').map((kv) => kv.split('=') as [string, string])
  );
  const timestamp = parts['t'];
  const signature = parts['v1'];
  if (!timestamp || !signature) throw new Error('Bad Stripe-Signature header');

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > toleranceSec) throw new Error('Webhook timestamp outside tolerance');

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
  if (!timingSafeEqual(expected, signature)) throw new Error('Signature mismatch');

  return JSON.parse(payload) as {
    id: string;
    type: string;
    data: { object: { id: string; metadata?: Record<string, string> } };
  };
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
