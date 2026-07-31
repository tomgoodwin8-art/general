// GET /api/pass/google/:serial?t=<authToken> — redirect to the Google Wallet
// "Save" link for this pass (creating the object first if needed).
import type { Env } from '../../../_lib/env';
import { requireEnv, notConfigured, json, siteUrl } from '../../../_lib/env';
import { Supabase } from '../../../_lib/supabase';
import { ensureClass, ensureObject, saveUrl } from '../../../_lib/googleWallet';
import { newGoogleObjectSuffix } from '../../../_lib/ids';
import type { PassRow } from '../../../_lib/provision';

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  const missing = requireEnv(env, [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GOOGLE_WALLET_ISSUER_ID',
    'GOOGLE_SA_EMAIL',
    'GOOGLE_SA_PRIVATE_KEY',
  ]);
  if (missing) return notConfigured(missing);

  const serial = String(params.serial);
  const token = new URL(request.url).searchParams.get('t');

  const db = new Supabase(env);
  const rows = await db.select<PassRow>('passes', { serial_number: serial }, '*', 1);
  const pass = rows[0];
  if (!pass) return json({ error: 'not_found' }, 404);
  if (!token || token !== pass.auth_token) return json({ error: 'unauthorized' }, 401);

  const members = await db.select<{ name: string | null }>('members', { id: pass.member_id }, 'name', 1);
  const memberName = members[0]?.name || 'Brentford Card Member';

  try {
    let objectId = pass.google_object_id;
    if (!objectId) {
      objectId = `${env.GOOGLE_WALLET_ISSUER_ID}.${newGoogleObjectSuffix()}`;
      await ensureClass(env);
      await ensureObject(env, {
        objectId,
        cardNumber: pass.card_number,
        memberName,
        tier: pass.tier,
        expiresOn: pass.expires_on,
      });
      await db.update('passes', { id: pass.id }, { google_object_id: objectId });
    }
    const url = await saveUrl(env, objectId, siteUrl(env, request));
    return new Response(null, { status: 302, headers: { Location: url, 'Cache-Control': 'no-store' } });
  } catch (err) {
    return json({ error: 'google_wallet_failed', message: (err as Error).message }, 500);
  }
};
