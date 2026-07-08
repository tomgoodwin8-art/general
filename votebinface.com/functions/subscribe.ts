// Cloudflare Pages Function: POST /subscribe
//
// STUB. Captures an email for the campaign list using DOUBLE OPT-IN: this
// endpoint should trigger a confirmation email, and the address is only added
// once the recipient clicks the link. Implement the confirmation step in your
// email provider (Mailchimp/Buttondown/etc.) and call it here.
//
// Set secrets in the Cloudflare Pages project settings (never commit them):
//   EMAIL_LIST_WEBHOOK_URL   provider endpoint that starts double opt-in
//
// GDPR: lawful basis is consent; see /privacy for retention and rights.

interface Env {
  EMAIL_LIST_WEBHOOK_URL?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid-body' }, 400);
  }

  const email = String(form.get('email') || '').trim();
  const consent = form.get('consent');

  if (!email || !consent) return json({ ok: false, error: 'missing-fields' }, 422);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: 'invalid-email' }, 422);
  }

  const payload = {
    type: 'subscribe',
    email,
    consent: true,
    doubleOptIn: true,
    submittedAt: new Date().toISOString(),
  };

  if (env.EMAIL_LIST_WEBHOOK_URL) {
    try {
      await fetch(env.EMAIL_LIST_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      return json({ ok: false, error: 'forward-failed' }, 502);
    }
  }

  return json({ ok: true });
};
