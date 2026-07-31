// GET /api/pass/by-session?session_id=cs_... — used by /card/success/ to fetch
// the buyer's pass. If the webhook hasn't landed yet, we verify the session
// with Stripe and provision synchronously so the page never dead-ends.
import type { Env } from '../../_lib/env';
import { requireEnv, notConfigured, json } from '../../_lib/env';
import { Supabase } from '../../_lib/supabase';
import { retrieveSession } from '../../_lib/stripe';
import { provisionMembership, type PassRow } from '../../_lib/provision';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const missing = requireEnv(env, ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  if (missing) return notConfigured(missing);

  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId) return json({ error: 'missing session_id' }, 400);

  const db = new Supabase(env);

  // 1) Fast path: webhook already provisioned it.
  let pass = await passForSession(db, sessionId);

  // 2) Fallback: confirm with Stripe and provision now.
  if (!pass && env.STRIPE_SECRET_KEY) {
    try {
      const s = await retrieveSession(env, sessionId);
      if (s.payment_status === 'paid' || s.status === 'complete') {
        pass = await provisionMembership(env, {
          email: s.customer_details?.email ?? s.customer_email,
          name: s.customer_details?.name ?? undefined,
          sessionId: s.id,
          paymentIntent: typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id,
          amountTotal: s.amount_total ?? undefined,
          currency: s.currency ?? undefined,
          stripeCustomerId: typeof s.customer === 'string' ? s.customer : s.customer?.id,
        });
      }
    } catch {
      /* fall through to not-ready */
    }
  }

  if (!pass) return json({ ready: false });
  return json({
    ready: true,
    serial: pass.serial_number,
    token: pass.auth_token,
    cardNumber: pass.card_number,
    tier: pass.tier,
  });
};

async function passForSession(db: Supabase, sessionId: string): Promise<PassRow | null> {
  const orders = await db.select<{ member_id: string }>('orders', { stripe_session_id: sessionId }, 'member_id', 1);
  if (!orders[0]?.member_id) return null;
  const passes = await db.select<PassRow>('passes', { member_id: orders[0].member_id }, '*', 1);
  return passes[0] ?? null;
}
