// POST /api/checkout — create a Stripe Checkout Session and redirect to it.
// The /card/ buy buttons submit a plain <form> here, so this works with zero
// client JS: we 303-redirect the browser straight to Stripe.
import type { Env } from '../_lib/env';
import { requireEnv, notConfigured, siteUrl, json } from '../_lib/env';
import { createCheckoutSession } from '../_lib/stripe';

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const missing = requireEnv(env, ['STRIPE_SECRET_KEY']);
  if (missing) return notConfigured(missing);

  const origin = siteUrl(env, request);
  const pricePence = Number(env.CARD_PRICE_PENCE ?? '2900');

  try {
    const session = await createCheckoutSession(env, {
      successUrl: `${origin}/card/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/card/?checkout=cancelled`,
      pricePence,
      priceId: env.STRIPE_PRICE_ID,
    });
    return new Response(null, { status: 303, headers: { Location: session.url } });
  } catch (err) {
    return json({ error: 'checkout_failed', message: (err as Error).message }, 502);
  }
};

// A stray GET (e.g. someone hitting the URL directly) just goes to the card page.
export const onRequestGet: PagesFunction<Env> = ({ request, env }) =>
  new Response(null, { status: 303, headers: { Location: `${siteUrl(env, request)}/card/` } });
