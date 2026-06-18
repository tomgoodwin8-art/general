// Cloudflare Pages Function: POST /api/subscribe
// Receives an email from any EmailCapture instance, validates it server-side,
// and subscribes it to Kit (ConvertKit) with a source tag. The API key never
// leaves the server (brief §7).

interface Env {
  KIT_API_KEY?: string;
  KIT_FORM_ID_COURSE?: string;
  KIT_FORM_ID_LAUNCH?: string;
}

type Ctx = {
  request: Request;
  env: Env;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function wantsJson(request: Request): boolean {
  const accept = request.headers.get('accept') ?? '';
  return accept.includes('application/json');
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function redirect(url: string, status = 303): Response {
  return new Response(null, { status, headers: { location: url } });
}

export const onRequestPost = async (context: Ctx): Promise<Response> => {
  const { request, env } = context;
  const json = wantsJson(request);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json
      ? jsonResponse({ ok: false, error: 'Invalid request.' }, 400)
      : redirect('/course?error=1');
  }

  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const honeypot = String(form.get('company') ?? '').trim();
  const source = String(form.get('source') ?? 'site').trim();
  const list = String(form.get('list') ?? 'course').trim() === 'launch' ? 'launch' : 'course';

  // Honeypot: a filled field means a bot. Respond as success without subscribing.
  if (honeypot) {
    return json ? jsonResponse({ ok: true, redirect: '/thanks' }) : redirect('/thanks');
  }

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json
      ? jsonResponse({ ok: false, error: 'Please enter a valid email address.' }, 422)
      : redirect('/course?error=1');
  }

  const apiKey = env.KIT_API_KEY;
  const formId = list === 'launch' ? env.KIT_FORM_ID_LAUNCH : env.KIT_FORM_ID_COURSE;

  if (!apiKey || !formId) {
    // Misconfiguration should be visible during the smoke test, not silently swallowed.
    return json
      ? jsonResponse({ ok: false, error: 'Signups are not configured yet. Please try again soon.' }, 503)
      : redirect('/course?error=config');
  }

  try {
    const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        email,
        // Custom field carries the capture source so the list is segmentable
        // from day one. Map it to tags via a Kit automation rule.
        fields: { dwh_source: source, dwh_list: list },
      }),
    });

    if (!res.ok) {
      return json
        ? jsonResponse({ ok: false, error: 'We could not sign you up just then. Please try again.' }, 502)
        : redirect('/course?error=1');
    }

    return json ? jsonResponse({ ok: true, redirect: '/thanks' }) : redirect('/thanks');
  } catch {
    return json
      ? jsonResponse({ ok: false, error: 'Network error. Please try again.' }, 502)
      : redirect('/course?error=1');
  }
};

// Pages Functions automatically respond 405 for methods without a handler,
// so only POST is defined here.
