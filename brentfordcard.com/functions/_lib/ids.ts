// Membership identifiers and secrets. All use WebCrypto for randomness.

function randomBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b;
}

function hex(bytes: Uint8Array): string {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Human-facing card number, e.g. BFC-7QX4-2K9M (Crockford base32, no ambiguous chars).
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function base32(bytes: Uint8Array, len: number): string {
  let out = '';
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

export function newCardNumber(): string {
  const b = randomBytes(8);
  const s = base32(b, 8);
  return `BFC-${s.slice(0, 4)}-${s.slice(4, 8)}`;
}

// Apple Wallet serial number — opaque, URL-safe, unique.
export function newSerial(): string {
  return hex(randomBytes(16));
}

// Auth token for the Apple Wallet web service (sent as ApplePass <token>).
export function newAuthToken(): string {
  return hex(randomBytes(24));
}

export function newGoogleObjectSuffix(): string {
  // Google object ids must match [A-Za-z0-9._-]; keep it short + unique.
  return hex(randomBytes(10));
}
