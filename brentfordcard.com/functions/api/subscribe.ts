// Cloudflare Pages Function: newsletter subscribe handler (brief §2).
// Honeypot + optional Turnstile + optional KV store / forward webhook.
interface Env {
  TURNSTILE_SECRET?: string;
  SUBMISSIONS?: KVNamespace;
  NEWSLETTER_FORWARD_URL?: string;
}

const seeOther = (location: string) =>
  new Response(null, { status: 303, headers: { Location: location } });

async function verifyTurnstile(secret: string, token: string, ip: string | null) {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  if (String(form.get('company') ?? '')) return seeOther('/?subscribed=1#newsletter');

  const email = String(form.get('email') ?? '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return seeOther('/?error=1#newsletter');

  if (env.TURNSTILE_SECRET) {
    const token = String(form.get('cf-turnstile-response') ?? '');
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET, token, request.headers.get('CF-Connecting-IP'));
    if (!ok) return seeOther('/?error=turnstile#newsletter');
  }

  const record = { type: 'newsletter', email, at: new Date().toISOString() };
  if (env.SUBMISSIONS) {
    await env.SUBMISSIONS.put(`newsletter:${email.toLowerCase()}`, JSON.stringify(record));
  }
  if (env.NEWSLETTER_FORWARD_URL) {
    await fetch(env.NEWSLETTER_FORWARD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).catch(() => {});
  }

  return seeOther('/?subscribed=1#newsletter');
};
