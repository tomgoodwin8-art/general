// Typed view of the environment bindings the payment/pass Functions need.
// Everything is optional so the Functions can boot and return a clean 503
// ("not configured") instead of crashing the whole Pages bundle before the
// user has set their secrets.
export interface Env {
  // Site
  SITE_URL?: string; // e.g. https://brentfordcard.com (defaults to request origin)

  // Supabase
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;

  // Stripe
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PRICE_ID?: string; // optional; if unset we create an inline price
  CARD_PRICE_PENCE?: string; // fallback inline price (default 2900)

  // Apple Wallet (PassKit) — PEMs stored base64-encoded to survive env storage
  APPLE_PASS_TYPE_ID?: string; // e.g. pass.com.brentfordcard.member
  APPLE_TEAM_ID?: string;
  APPLE_PASS_CERT_P12_BASE64?: string; // OR the split PEM pair below
  APPLE_PASS_CERT_PEM_BASE64?: string; // signer cert (PEM)
  APPLE_PASS_KEY_PEM_BASE64?: string; // signer private key (PEM)
  APPLE_PASS_KEY_PASSWORD?: string;
  APPLE_WWDR_PEM_BASE64?: string; // Apple WWDR intermediate cert (PEM)

  // Google Wallet
  GOOGLE_WALLET_ISSUER_ID?: string;
  GOOGLE_WALLET_CLASS_ID?: string; // e.g. <issuerId>.brentford_card
  GOOGLE_SA_EMAIL?: string;
  GOOGLE_SA_PRIVATE_KEY?: string; // service-account private key (PEM, \n escaped ok)

  // Optional transactional email (Resend) for the pass link
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
}

export function requireEnv<K extends keyof Env>(env: Env, keys: K[]): string[] | null {
  const missing = keys.filter((k) => !env[k]);
  return missing.length ? (missing as string[]) : null;
}

export function siteUrl(env: Env, request: Request): string {
  if (env.SITE_URL) return env.SITE_URL.replace(/\/$/, '');
  return new URL(request.url).origin;
}

export const json = (data: unknown, status = 200, headers: HeadersInit = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers },
  });

export const notConfigured = (missing: string[]) =>
  json(
    {
      error: 'not_configured',
      message: 'This endpoint is not configured yet. Set the missing environment variables in the Cloudflare Pages dashboard.',
      missing,
    },
    503,
  );

// Decode a base64 env value to a UTF-8 string (PEMs) or raw bytes.
export function b64ToString(b64: string): string {
  const bin = atob(b64.trim());
  return bin;
}
export function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64.trim());
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
