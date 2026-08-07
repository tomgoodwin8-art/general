// Shared types for Pages Functions. Files/dirs prefixed with `_` are not routed.

export interface Env {
  // Secrets (wrangler pages secret put ...). All optional so functions can
  // degrade gracefully in preview/sandbox without keys (brief §6.2).
  SEMBLE_API_KEY?: string;
  SEMBLE_API_URL?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PUBLISHABLE_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  GA4_ID?: string;
  // KV binding for the 60s availability cache (optional).
  AVAILABILITY_CACHE?: KVNamespace;
}

export function json(data: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra },
  });
}

export function badRequest(message: string) {
  return json({ error: message }, 400);
}

/** True when Semble is configured; otherwise callers return a sandbox stub. */
export function sembleReady(env: Env): boolean {
  return Boolean(env.SEMBLE_API_KEY && env.SEMBLE_API_URL);
}

export function stripeReady(env: Env): boolean {
  return Boolean(env.STRIPE_SECRET_KEY);
}
