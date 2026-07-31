// Google Wallet: provision the pass class/object and mint a "Save" JWT link.
// Uses jose (Workers-compatible) for RS256 signing.
import { SignJWT, importPKCS8 } from 'jose';
import type { Env } from './env';

const WOBJ = 'https://walletobjects.googleapis.com/walletobjects/v1';

function privateKeyPem(env: Env): string {
  return (env.GOOGLE_SA_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');
}
function classId(env: Env): string {
  return env.GOOGLE_WALLET_CLASS_ID ?? `${env.GOOGLE_WALLET_ISSUER_ID}.brentford_card`;
}

async function accessToken(env: Env): Promise<string> {
  const key = await importPKCS8(privateKeyPem(env), 'RS256');
  const now = Math.floor(Date.now() / 1000);
  const assertion = await new SignJWT({ scope: 'https://www.googleapis.com/auth/wallet_object.issuer' })
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuer(env.GOOGLE_SA_EMAIL!)
    .setSubject(env.GOOGLE_SA_EMAIL!)
    .setAudience('https://oauth2.googleapis.com/token')
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const data = (await res.json()) as { access_token?: string };
  if (!res.ok || !data.access_token) throw new Error(`Google token exchange failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

function classBody(env: Env) {
  return {
    id: classId(env),
    classTemplateInfo: {},
    reviewStatus: 'UNDER_REVIEW',
    hexBackgroundColor: '#2e4a43',
    logo: {
      sourceUri: { uri: 'https://brentfordcard.com/mark.svg' },
      contentDescription: { defaultValue: { language: 'en-GB', value: 'Brentford Card' } },
    },
  };
}

// Create the class if it doesn't exist yet (idempotent).
export async function ensureClass(env: Env): Promise<void> {
  const token = await accessToken(env);
  const id = classId(env);
  const get = await fetch(`${WOBJ}/genericClass/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (get.ok) return;
  if (get.status !== 404) throw new Error(`genericClass GET failed: ${get.status} ${await get.text()}`);
  const post = await fetch(`${WOBJ}/genericClass`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(classBody(env)),
  });
  if (!post.ok) throw new Error(`genericClass insert failed: ${post.status} ${await post.text()}`);
}

export interface GoogleObjectData {
  objectId: string; // `${issuerId}.<suffix>`
  cardNumber: string;
  memberName: string;
  tier: 'founding' | 'member';
  expiresOn: string;
}

function objectBody(env: Env, d: GoogleObjectData) {
  return {
    id: d.objectId,
    classId: classId(env),
    state: 'ACTIVE',
    hexBackgroundColor: '#2e4a43',
    logo: {
      sourceUri: { uri: 'https://brentfordcard.com/mark.svg' },
      contentDescription: { defaultValue: { language: 'en-GB', value: 'Brentford Card' } },
    },
    cardTitle: { defaultValue: { language: 'en-GB', value: 'The Brentford Card' } },
    header: { defaultValue: { language: 'en-GB', value: d.memberName } },
    subheader: {
      defaultValue: { language: 'en-GB', value: d.tier === 'founding' ? 'Founding Member' : 'Member' },
    },
    barcode: { type: 'QR_CODE', value: d.cardNumber, alternateText: d.cardNumber },
    textModulesData: [
      { id: 'card', header: 'Card No.', body: d.cardNumber },
      { id: 'area', header: 'Area', body: 'Brentford · TW8' },
      { id: 'expires', header: 'Valid until', body: d.expiresOn },
    ],
    linksModuleData: {
      uris: [
        { uri: 'https://brentfordcard.com/directory/', description: 'Participating businesses' },
        { uri: 'https://brentfordcard.com/terms/', description: 'Terms & conditions' },
      ],
    },
  };
}

// Create the object server-side (so the pass exists even before it's saved).
export async function ensureObject(env: Env, d: GoogleObjectData): Promise<void> {
  const token = await accessToken(env);
  const get = await fetch(`${WOBJ}/genericObject/${encodeURIComponent(d.objectId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (get.ok) return;
  if (get.status !== 404) throw new Error(`genericObject GET failed: ${get.status} ${await get.text()}`);
  const post = await fetch(`${WOBJ}/genericObject`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(objectBody(env, d)),
  });
  if (!post.ok) throw new Error(`genericObject insert failed: ${post.status} ${await post.text()}`);
}

// Mint the "Save to Google Wallet" URL referencing the (already created) object.
export async function saveUrl(env: Env, objectId: string, origin: string): Promise<string> {
  const key = await importPKCS8(privateKeyPem(env), 'RS256');
  const jwt = await new SignJWT({
    typ: 'savetowallet',
    payload: { genericObjects: [{ id: objectId }] },
    origins: [origin],
  })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(env.GOOGLE_SA_EMAIL!)
    .setAudience('google')
    .setIssuedAt()
    .sign(key);
  return `https://pay.google.com/gp/v/save/${jwt}`;
}
