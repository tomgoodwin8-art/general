// Apple Wallet Web Service (PassKit) — handles device registration and pass
// updates so passes can be pushed/refreshed. Mounted at /api/apple/*.
// Spec: developer.apple.com/documentation/walletpasses (v1 endpoints).
import type { Env } from '../../_lib/env';
import { requireEnv, notConfigured, json, siteUrl } from '../../_lib/env';
import { Supabase } from '../../_lib/supabase';
import { buildPkpass } from '../../_lib/applePass';
import type { PassRow } from '../../_lib/provision';

function authOk(request: Request, pass: PassRow): boolean {
  const h = request.headers.get('Authorization') ?? '';
  const m = h.match(/^ApplePass\s+(.+)$/i);
  return !!m && m[1] === pass.auth_token;
}

export const onRequest: PagesFunction<Env> = async ({ request, env, params }) => {
  const missing = requireEnv(env, ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  if (missing) return notConfigured(missing);

  const seg = (params.path as string[]) ?? [];
  const db = new Supabase(env);
  const method = request.method.toUpperCase();

  // POST /v1/log — Apple posts diagnostics here.
  if (seg[0] === 'v1' && seg[1] === 'log' && method === 'POST') {
    try { console.log('ApplePass log:', await request.text()); } catch {}
    return json({ ok: true });
  }

  // /v1/devices/{deviceLibraryId}/registrations/{passTypeId}[/{serialNumber}]
  if (seg[0] === 'v1' && seg[1] === 'devices' && seg[3] === 'registrations') {
    const deviceLibraryId = seg[2];
    const passTypeId = seg[4];
    const serial = seg[5];

    // GET .../registrations/{passTypeId}?passesUpdatedSince=... — serials list
    if (method === 'GET' && !serial) {
      const regs = await db.select<{ pass_serial: string }>(
        'pass_devices',
        { device_library_id: deviceLibraryId, pass_type_id: passTypeId },
        'pass_serial',
      );
      if (!regs.length) return new Response(null, { status: 204 });
      // We could filter by passesUpdatedSince; return all + a tag for simplicity.
      return json({ serialNumbers: regs.map((r) => r.pass_serial), lastUpdated: String(Date.now()) });
    }

    // Register / unregister a device for a pass.
    if (serial) {
      const rows = await db.select<PassRow>('passes', { serial_number: serial }, '*', 1);
      const pass = rows[0];
      if (!pass) return json({ error: 'not_found' }, 404);
      if (!authOk(request, pass)) return new Response(null, { status: 401 });

      if (method === 'POST') {
        const body = (await request.json().catch(() => ({}))) as { pushToken?: string };
        await db.insert(
          'pass_devices',
          {
            device_library_id: deviceLibraryId,
            pass_serial: serial,
            push_token: body.pushToken ?? '',
            pass_type_id: passTypeId,
          },
          { upsertOn: 'device_library_id,pass_serial' },
        );
        return new Response(null, { status: 201 });
      }
      if (method === 'DELETE') {
        await db.delete('pass_devices', { device_library_id: deviceLibraryId, pass_serial: serial });
        return new Response(null, { status: 200 });
      }
    }
  }

  // GET /v1/passes/{passTypeId}/{serialNumber} — latest signed pass.
  if (seg[0] === 'v1' && seg[1] === 'passes' && seg[3] && method === 'GET') {
    const serial = seg[3];
    const rows = await db.select<PassRow>('passes', { serial_number: serial }, '*', 1);
    const pass = rows[0];
    if (!pass) return json({ error: 'not_found' }, 404);
    if (!authOk(request, pass)) return new Response(null, { status: 401 });

    const appleMissing = requireEnv(env, ['APPLE_PASS_TYPE_ID', 'APPLE_TEAM_ID', 'APPLE_WWDR_PEM_BASE64']);
    if (appleMissing) return notConfigured(appleMissing);

    const members = await db.select<{ name: string | null }>('members', { id: pass.member_id }, 'name', 1);
    const pkpass = buildPkpass(env, {
      serialNumber: pass.serial_number,
      authToken: pass.auth_token,
      cardNumber: pass.card_number,
      memberName: members[0]?.name || 'Brentford Card Member',
      tier: pass.tier,
      expiresOn: pass.expires_on,
      webServiceURL: `${siteUrl(env, request)}/api/apple`,
    });
    return new Response(pkpass as unknown as BodyInit, {
      headers: { 'Content-Type': 'application/vnd.apple.pkpass', 'Last-Modified': new Date().toUTCString() },
    });
  }

  return json({ error: 'not_found' }, 404);
};
