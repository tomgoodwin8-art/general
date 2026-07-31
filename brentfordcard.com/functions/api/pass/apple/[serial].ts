// GET /api/pass/apple/:serial?t=<authToken> — build and serve the signed .pkpass.
import type { Env } from '../../../_lib/env';
import { requireEnv, notConfigured, json, siteUrl } from '../../../_lib/env';
import { Supabase } from '../../../_lib/supabase';
import { buildPkpass } from '../../../_lib/applePass';
import type { PassRow } from '../../../_lib/provision';

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const missing = requireEnv(env, [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'APPLE_PASS_TYPE_ID',
    'APPLE_TEAM_ID',
    'APPLE_WWDR_PEM_BASE64',
  ]);
  if (missing) return notConfigured(missing);

  const serial = String(params.serial);
  const token = new URL(request.url).searchParams.get('t');

  const db = new Supabase(env);
  const rows = await db.select<PassRow & { member: any }>('passes', { serial_number: serial }, '*', 1);
  const pass = rows[0];
  if (!pass) return json({ error: 'not_found' }, 404);
  if (!token || token !== pass.auth_token) return json({ error: 'unauthorized' }, 401);

  // Member name for the pass face.
  const members = await db.select<{ name: string | null }>('members', { id: pass.member_id }, 'name', 1);
  const memberName = members[0]?.name || 'Brentford Card Member';

  let pkpass: Uint8Array;
  try {
    pkpass = buildPkpass(env, {
      serialNumber: pass.serial_number,
      authToken: pass.auth_token,
      cardNumber: pass.card_number,
      memberName,
      tier: pass.tier,
      expiresOn: pass.expires_on,
      webServiceURL: `${siteUrl(env, request)}/api/apple`,
    });
  } catch (err) {
    return json({ error: 'pass_build_failed', message: (err as Error).message }, 500);
  }

  return new Response(pkpass as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename="brentford-card-${pass.card_number}.pkpass"`,
      'Cache-Control': 'no-store',
    },
  });
};
