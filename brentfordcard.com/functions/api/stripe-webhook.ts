// POST /api/stripe-webhook — Stripe calls this after a successful payment.
// Verifies the signature, then provisions member + order + pass in Supabase.
import type { Env } from '../_lib/env';
import { requireEnv, notConfigured, json } from '../_lib/env';
import { verifyWebhook } from '../_lib/stripe';
import { provisionMembership } from '../_lib/provision';
import { sendPassEmail } from '../_lib/email';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const missing = requireEnv(env, [
    'STRIPE_WEBHOOK_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]);
  if (missing) return notConfigured(missing);

  const payload = await request.text();
  let event: any;
  try {
    event = await verifyWebhook(payload, request.headers.get('Stripe-Signature'), env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return json({ error: 'invalid_signature', message: (err as Error).message }, 400);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object;
      const email: string | undefined =
        s.customer_details?.email ?? s.customer_email ?? undefined;
      if (!email) return json({ received: true, note: 'no email on session' });

      const pass = await provisionMembership(env, {
        email,
        name: s.customer_details?.name ?? undefined,
        sessionId: s.id,
        paymentIntent: typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id,
        amountTotal: s.amount_total ?? undefined,
        currency: s.currency ?? undefined,
        stripeCustomerId: typeof s.customer === 'string' ? s.customer : s.customer?.id,
      });

      // Best-effort welcome email with the wallet link.
      await sendPassEmail(env, request, { email, name: s.customer_details?.name, pass }).catch(() => {});
    } else if (event.type === 'charge.refunded' || event.type === 'refund.created') {
      // (Optional) mark the membership refunded — left as a hook for later.
    }
    return json({ received: true });
  } catch (err) {
    // Return 500 so Stripe retries transient failures.
    return json({ error: 'provision_failed', message: (err as Error).message }, 500);
  }
};
