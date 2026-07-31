// Cloudflare Pages Function: contact form handler (brief §2).
// Verifies Cloudflare Turnstile, rejects honeypot hits, and (if a KV namespace
// named SUBMISSIONS is bound) stores the message. No third-party form SaaS.
interface Env {
  TURNSTILE_SECRET?: string;
  SUBMISSIONS?: KVNamespace;
  CONTACT_FORWARD_URL?: string; // optional webhook to forward submissions
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
  const honeypot = String(form.get('company') ?? '');
  if (honeypot) return seeOther('/contact/?sent=1'); // silently drop bots

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim();
  const subject = String(form.get('subject') ?? 'member').trim();
  const message = String(form.get('message') ?? '').trim();

  if (!name || !email || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return seeOther('/contact/?error=1');
  }

  // Turnstile (skipped only if no secret configured — flagged in README).
  if (env.TURNSTILE_SECRET) {
    const token = String(form.get('cf-turnstile-response') ?? '');
    const ip = request.headers.get('CF-Connecting-IP');
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET, token, ip);
    if (!ok) return seeOther('/contact/?error=turnstile');
  }

  const record = { type: 'contact', name, email, subject, message, at: new Date().toISOString() };

  if (env.SUBMISSIONS) {
    await env.SUBMISSIONS.put(`contact:${Date.now()}:${crypto.randomUUID()}`, JSON.stringify(record));
  }
  if (env.CONTACT_FORWARD_URL) {
    await fetch(env.CONTACT_FORWARD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }).catch(() => {});
  }

  return seeOther('/contact/?sent=1');
};

// GET falls through to the static page.
export const onRequestGet: PagesFunction<Env> = () => seeOther('/contact/');
