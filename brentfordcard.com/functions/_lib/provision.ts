// Turns a completed payment into a member + order + wallet pass in Supabase,
// then (best-effort) provisions the Google Wallet object and emails the pass.
import type { Env } from './env';
import { Supabase } from './supabase';
import { newSerial, newAuthToken, newCardNumber, newGoogleObjectSuffix } from './ids';
import { ensureClass, ensureObject } from './googleWallet';

export interface PaymentFacts {
  email: string;
  name?: string;
  sessionId?: string;
  paymentIntent?: string;
  amountTotal?: number;
  currency?: string;
  stripeCustomerId?: string;
}

export interface PassRow {
  id: string;
  member_id: string;
  serial_number: string;
  auth_token: string;
  card_number: string;
  tier: 'founding' | 'member';
  expires_on: string;
  google_object_id: string | null;
}

// Idempotent on the Stripe session: a replayed webhook returns the existing pass.
export async function provisionMembership(env: Env, facts: PaymentFacts): Promise<PassRow> {
  const db = new Supabase(env);

  // Short-circuit if this session was already processed.
  if (facts.sessionId) {
    const existingOrders = await db.select<{ id: string; member_id: string }>(
      'orders',
      { stripe_session_id: facts.sessionId },
      'id,member_id',
      1,
    );
    if (existingOrders[0]?.member_id) {
      const passes = await db.select<PassRow>('passes', { member_id: existingOrders[0].member_id }, '*', 1);
      if (passes[0]) return passes[0];
    }
  }

  // Founding member if we're still within the first N passes.
  const totalPasses = await countPasses(db);
  const FOUNDING_LIMIT = 250;
  const isFounding = totalPasses < FOUNDING_LIMIT;

  // Upsert member by email.
  const members = await db.insert<{ id: string }>(
    'members',
    {
      email: facts.email,
      name: facts.name ?? null,
      stripe_customer_id: facts.stripeCustomerId ?? null,
      founding: isFounding,
      status: 'active',
    },
    { upsertOn: 'email' },
  );
  const memberId = members[0].id;

  // Record the order.
  await db.insert('orders', {
    member_id: memberId,
    stripe_session_id: facts.sessionId ?? null,
    stripe_payment_intent: facts.paymentIntent ?? null,
    amount_total: facts.amountTotal ?? null,
    currency: (facts.currency ?? 'gbp').toLowerCase(),
    status: 'paid',
  });

  // Reuse an existing active pass for this member, else create one.
  const existingPass = await db.select<PassRow>('passes', { member_id: memberId }, '*', 1);
  if (existingPass[0]) return maybeProvisionGoogle(env, db, existingPass[0], facts);

  const created = await db.insert<PassRow>('passes', {
    member_id: memberId,
    serial_number: newSerial(),
    auth_token: newAuthToken(),
    card_number: newCardNumber(),
    tier: isFounding ? 'founding' : 'member',
  });
  return maybeProvisionGoogle(env, db, created[0], facts);
}

async function countPasses(db: Supabase): Promise<number> {
  // PostgREST returns rows; for a simple bound we fetch ids with a high limit.
  const rows = await db.select<{ id: string }>('passes', {}, 'id', 1000);
  return rows.length;
}

async function maybeProvisionGoogle(env: Env, db: Supabase, pass: PassRow, facts: PaymentFacts): Promise<PassRow> {
  if (pass.google_object_id) return pass;
  if (!env.GOOGLE_WALLET_ISSUER_ID || !env.GOOGLE_SA_EMAIL || !env.GOOGLE_SA_PRIVATE_KEY) return pass;
  try {
    const objectId = `${env.GOOGLE_WALLET_ISSUER_ID}.${newGoogleObjectSuffix()}`;
    await ensureClass(env);
    await ensureObject(env, {
      objectId,
      cardNumber: pass.card_number,
      memberName: facts.name ?? 'Brentford Card Member',
      tier: pass.tier,
      expiresOn: pass.expires_on,
    });
    const updated = await db.update<PassRow>('passes', { id: pass.id }, { google_object_id: objectId });
    return updated[0] ?? { ...pass, google_object_id: objectId };
  } catch (err) {
    // Non-fatal: the member still has a pass; Google can be retried later.
    console.error('Google Wallet provisioning failed:', (err as Error).message);
    return pass;
  }
}
