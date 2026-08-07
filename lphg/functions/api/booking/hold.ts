// POST /api/booking/hold — find/create patient, create a pending Semble
// booking, open a Stripe PaymentIntent with bookingId in metadata, return the
// client_secret. No PII is logged (brief §6.3).
import type { Env } from '../../_lib/env';
import { json, badRequest, sembleReady, stripeReady } from '../../_lib/env';
import { findOrCreatePatient, createPendingBooking } from '../../_lib/semble';
import { createPaymentIntent } from '../../_lib/stripe';
import catalog from '../../_lib/catalog.json';

interface Body {
  bookingTypeId?: string;
  start?: string;
  practitionerId?: string;
  patient?: {
    firstName: string;
    lastName: string;
    dob: string;
    sex: string;
    email: string;
    phone: string;
    reason?: string;
  };
  consent?: { privacy: boolean; comms: boolean };
}

type Catalog = Record<string, { title: string; price: number; kind: string; slug: string }>;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON');
  }

  const { bookingTypeId, start, practitionerId, patient, consent } = body;
  if (!bookingTypeId || !start || !patient) return badRequest('Missing booking details');
  if (!consent?.privacy) return badRequest('Privacy consent is required to book');
  for (const f of ['firstName', 'lastName', 'dob', 'sex', 'email', 'phone'] as const) {
    if (!patient[f]) return badRequest(`Missing ${f}`);
  }

  const item = (catalog as Catalog)[bookingTypeId];
  if (!item) return badRequest('Unknown service');

  // Sandbox stub: no Semble/Stripe keys → return a demo client_secret so the UI
  // flow is testable without live processors.
  if (!sembleReady(env) || !stripeReady(env)) {
    return json({
      configured: false,
      bookingId: `demo_${bookingTypeId}`,
      amount: item.price * 100,
      currency: 'gbp',
      publishableKey: env.STRIPE_PUBLISHABLE_KEY ?? null,
      client_secret: null,
      message: 'Booking sandbox: connect Semble and Stripe to take a live payment.',
    });
  }

  try {
    const patientId = await findOrCreatePatient(env, patient);
    const bookingId = await createPendingBooking(env, {
      bookingTypeId,
      patientId,
      start,
      practitionerId: practitionerId ?? '',
      reason: patient.reason,
    });
    const intent = await createPaymentIntent(env, {
      amount: item.price * 100,
      currency: 'gbp',
      bookingId,
      email: patient.email,
      description: `${item.title} — LPHG`,
    });
    return json({
      configured: true,
      bookingId,
      amount: item.price * 100,
      currency: 'gbp',
      publishableKey: env.STRIPE_PUBLISHABLE_KEY,
      client_secret: intent.client_secret,
    });
  } catch (err) {
    return json({ error: 'hold_failed', message: String(err) }, 502);
  }
};
