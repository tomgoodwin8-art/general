// Cloudflare Pages Function: POST /volunteer-signup
//
// STUB. Validates the volunteer form and forwards it on. Wire up ONE of:
//   - VOLUNTEER_WEBHOOK_URL: a webhook (e.g. a Google Apps Script bound to a
//     Sheet, or a Zapier/Make hook) that receives the JSON body.
//   - Or replace the forward block with your email provider's API call.
//
// Set secrets in the Cloudflare Pages project settings (never commit them):
//   VOLUNTEER_WEBHOOK_URL   destination for submissions
//
// GDPR: consent is required and captured. Do not store data you do not need;
// retention and rights are described in /privacy.

interface Env {
  VOLUNTEER_WEBHOOK_URL?: string;
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

  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const postcode = String(form.get('postcode') || '').trim();
  const availability = String(form.get('availability') || '').trim();
  const consent = form.get('consent');

  if (!name || !email || !postcode || !consent) {
    return json({ ok: false, error: 'missing-fields' }, 422);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ ok: false, error: 'invalid-email' }, 422);
  }

  const payload = {
    type: 'volunteer',
    name,
    email,
    postcode,
    availability,
    consent: true,
    submittedAt: new Date().toISOString(),
  };

  if (env.VOLUNTEER_WEBHOOK_URL) {
    try {
      await fetch(env.VOLUNTEER_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      return json({ ok: false, error: 'forward-failed' }, 502);
    }
  }
  // No webhook configured: accept and no-op (safe default for preview builds).

  return json({ ok: true });
};
