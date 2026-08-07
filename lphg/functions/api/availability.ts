// POST /api/availability — bookable slots for a service over a date range.
// Cached 60s per service/week in KV when the binding is present (brief §6.2).
import type { Env } from '../_lib/env';
import { json, badRequest, sembleReady } from '../_lib/env';
import { getAvailability } from '../_lib/semble';

interface Body {
  bookingTypeId?: string;
  from?: string;
  to?: string;
  practitionerId?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON');
  }
  const { bookingTypeId, from, to, practitionerId } = body;
  if (!bookingTypeId || !from || !to) return badRequest('bookingTypeId, from and to are required');

  // Sandbox stub when Semble is not configured — synthetic weekday slots so the
  // wizard is demonstrable end to end without credentials (open item §11).
  if (!sembleReady(env)) {
    return json({ configured: false, slots: syntheticSlots(from, to) });
  }

  const cacheKey = `avail:${bookingTypeId}:${from}:${to}:${practitionerId ?? 'any'}`;
  if (env.AVAILABILITY_CACHE) {
    const hit = await env.AVAILABILITY_CACHE.get(cacheKey);
    if (hit) return json({ configured: true, cached: true, slots: JSON.parse(hit) });
  }

  try {
    const slots = await getAvailability(env, bookingTypeId, from, to, practitionerId);
    if (env.AVAILABILITY_CACHE) {
      await env.AVAILABILITY_CACHE.put(cacheKey, JSON.stringify(slots), { expirationTtl: 60 });
    }
    return json({ configured: true, slots });
  } catch (err) {
    return json({ error: 'availability_unavailable', message: String(err) }, 502);
  }
};

function syntheticSlots(from: string, to: string) {
  const start = new Date(from);
  const end = new Date(to);
  const times = ['09:00', '10:30', '13:00', '15:30'];
  const out: { start: string; end: string; practitionerId: string; practitionerName: string }[] = [];
  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const day = d.getUTCDay();
    if (day === 0) continue; // closed Sunday
    for (const t of times) {
      const [h, m] = t.split(':').map(Number);
      const s = new Date(d);
      s.setUTCHours(h, m, 0, 0);
      const e = new Date(s.getTime() + 30 * 60000);
      out.push({
        start: s.toISOString(),
        end: e.toISOString(),
        practitionerId: 'demo',
        practitionerName: 'First available',
      });
    }
  }
  return out;
}
