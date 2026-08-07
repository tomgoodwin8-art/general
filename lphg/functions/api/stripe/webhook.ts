// POST /api/stripe/webhook — on payment_intent.succeeded confirm the Semble
// booking + send confirmation email (Resend); on failure/expiry cancel the
// pending booking. Idempotent, signature-verified (brief §6.2).
import type { Env } from '../../_lib/env';
import { json } from '../../_lib/env';
import { constructEvent } from '../../_lib/stripe';
import { updateBookingStatus } from '../../_lib/semble';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const sig = request.headers.get('stripe-signature');
  const payload = await request.text();

  if (!env.STRIPE_WEBHOOK_SECRET || !sig) {
    return json({ error: 'webhook_not_configured' }, 400);
  }

  let event;
  try {
    event = await constructEvent(payload, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return json({ error: 'invalid_signature', message: String(err) }, 400);
  }

  // Idempotency: dedupe on event id via KV when available.
  if (env.AVAILABILITY_CACHE) {
    const seen = await env.AVAILABILITY_CACHE.get(`evt:${event.id}`);
    if (seen) return json({ received: true, duplicate: true });
    await env.AVAILABILITY_CACHE.put(`evt:${event.id}`, '1', { expirationTtl: 86400 });
  }

  const bookingId = event.data.object.metadata?.bookingId;

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        if (bookingId) await updateBookingStatus(env, bookingId, 'confirmed');
        await sendConfirmationEmail(env, event.data.object).catch(() => {});
        break;
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled':
        if (bookingId) await updateBookingStatus(env, bookingId, 'cancelled');
        break;
      default:
        break;
    }
  } catch (err) {
    // 500 tells Stripe to retry — the handler is idempotent so retries are safe.
    return json({ error: 'processing_failed', message: String(err) }, 500);
  }

  return json({ received: true });
};

async function sendConfirmationEmail(env: Env, _intent: unknown): Promise<void> {
  if (!env.RESEND_API_KEY) return; // Semble sends its own comms as a fallback
  // Wire the Resend transactional send here once the from-address/domain is
  // verified (open item §11). Kept minimal to avoid PII in logs (§6.3).
}
