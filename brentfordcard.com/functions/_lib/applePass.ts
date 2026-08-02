// Apple Wallet .pkpass builder + signer.
// Pure-JS crypto (node-forge) + zip (fflate) so it runs on the Workers runtime.
//
// Requires (from env): the Pass Type ID signing certificate + private key and
// the Apple WWDR intermediate certificate. Provide either a base64 .p12 bundle
// (APPLE_PASS_CERT_P12_BASE64 + APPLE_PASS_KEY_PASSWORD) or a base64 PEM pair
// (APPLE_PASS_CERT_PEM_BASE64 + APPLE_PASS_KEY_PEM_BASE64), plus
// APPLE_WWDR_PEM_BASE64.
import forge from 'node-forge';
import { zipSync } from 'fflate';
import type { Env } from './env';
import { b64ToString } from './env';
import { PASS_ASSETS } from './passAssets';

const TOKENS = {
  ink: 'rgb(16,22,20)',
  plaster: 'rgb(242,238,230)',
  river: 'rgb(46,74,67)',
  brass: 'rgb(176,141,62)',
  mist: 'rgb(201,207,201)',
};

export interface PassData {
  serialNumber: string;
  authToken: string;
  cardNumber: string;
  memberName: string;
  tier: 'founding' | 'member';
  expiresOn: string; // ISO date
  webServiceURL: string; // https://.../api/apple
}

function buildPassJson(env: Env, d: PassData) {
  return {
    formatVersion: 1,
    passTypeIdentifier: env.APPLE_PASS_TYPE_ID,
    teamIdentifier: env.APPLE_TEAM_ID,
    organizationName: 'The Brentford Card',
    description: 'The Brentford Card membership',
    serialNumber: d.serialNumber,
    logoText: 'Brentford Card',
    foregroundColor: TOKENS.plaster,
    backgroundColor: TOKENS.river,
    labelColor: TOKENS.brass,
    webServiceURL: d.webServiceURL,
    authenticationToken: d.authToken,
    sharingProhibited: true,
    barcodes: [
      {
        format: 'PKBarcodeFormatQR',
        message: d.cardNumber,
        messageEncoding: 'iso-8859-1',
        altText: d.cardNumber,
      },
    ],
    generic: {
      primaryFields: [
        { key: 'member', label: 'MEMBER', value: d.memberName },
      ],
      secondaryFields: [
        { key: 'tier', label: 'MEMBERSHIP', value: 'Member' },
        { key: 'card', label: 'CARD No.', value: d.cardNumber },
      ],
      auxiliaryFields: [
        { key: 'area', label: 'AREA', value: 'Brentford · TW8' },
        { key: 'expires', label: 'VALID UNTIL', value: d.expiresOn, dateStyle: 'PKDateStyleMedium' },
      ],
      backFields: [
        { key: 'about', label: 'About', value: 'The Brentford Card gives you discounts and offers at independent businesses across Brentford (TW8). Show this pass in store to redeem.' },
        { key: 'redeem', label: 'How to redeem', value: 'Show this pass to a member of staff before you pay. See participating businesses at brentfordcard.com/directory.' },
        { key: 'terms', label: 'Terms', value: 'Non-transferable. Offers can change and businesses may withdraw. Full terms at brentfordcard.com/terms.' },
        { key: 'site', label: 'Website', value: 'https://brentfordcard.com', attributedValue: '<a href="https://brentfordcard.com">brentfordcard.com</a>' },
      ],
    },
  };
}

// ---- crypto helpers ---------------------------------------------------------
function bytesToBinary(bytes: Uint8Array): string {
  return forge.util.binary.raw.encode(bytes);
}
function binaryToBytes(bin: string): Uint8Array {
  return forge.util.binary.raw.decode(bin);
}
function sha1Hex(bytes: Uint8Array): string {
  const md = forge.md.sha1.create();
  md.update(bytesToBinary(bytes));
  return md.digest().toHex();
}

interface SigningMaterial {
  cert: forge.pki.Certificate;
  key: forge.pki.PrivateKey;
  wwdr: forge.pki.Certificate;
}

function loadSigningMaterial(env: Env): SigningMaterial {
  if (!env.APPLE_WWDR_PEM_BASE64) throw new Error('APPLE_WWDR_PEM_BASE64 not set');
  const wwdr = forge.pki.certificateFromPem(b64ToString(env.APPLE_WWDR_PEM_BASE64));

  if (env.APPLE_PASS_CERT_P12_BASE64) {
    const der = forge.util.binary.raw.encode(
      Uint8Array.from(atob(env.APPLE_PASS_CERT_P12_BASE64.trim()), (c) => c.charCodeAt(0)),
    );
    const p12Asn1 = forge.asn1.fromDer(der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, env.APPLE_PASS_KEY_PASSWORD ?? '');
    const certBag = p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag]?.[0];
    const keyBag =
      p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0] ??
      p12.getBags({ bagType: forge.pki.oids.keyBag })[forge.pki.oids.keyBag]?.[0];
    if (!certBag?.cert || !keyBag?.key) throw new Error('Could not extract cert/key from .p12');
    return { cert: certBag.cert, key: keyBag.key, wwdr };
  }

  if (env.APPLE_PASS_CERT_PEM_BASE64 && env.APPLE_PASS_KEY_PEM_BASE64) {
    const cert = forge.pki.certificateFromPem(b64ToString(env.APPLE_PASS_CERT_PEM_BASE64));
    const keyPem = b64ToString(env.APPLE_PASS_KEY_PEM_BASE64);
    const key = env.APPLE_PASS_KEY_PASSWORD
      ? forge.pki.decryptRsaPrivateKey(keyPem, env.APPLE_PASS_KEY_PASSWORD)
      : forge.pki.privateKeyFromPem(keyPem);
    if (!key) throw new Error('Could not read Apple pass private key');
    return { cert, key, wwdr };
  }

  throw new Error('No Apple signing certificate configured');
}

function signManifest(manifest: Uint8Array, m: SigningMaterial): Uint8Array {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(bytesToBinary(manifest));
  p7.addCertificate(m.cert);
  p7.addCertificate(m.wwdr);
  p7.addSigner({
    key: m.key as forge.pki.rsa.PrivateKey,
    certificate: m.cert,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime, value: (new Date()).toISOString() as any },
    ],
  });
  p7.sign({ detached: true });
  const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
  return binaryToBytes(der);
}

// Build and sign a .pkpass, returning the raw zip bytes.
export function buildPkpass(env: Env, d: PassData): Uint8Array {
  if (!env.APPLE_PASS_TYPE_ID || !env.APPLE_TEAM_ID) {
    throw new Error('APPLE_PASS_TYPE_ID / APPLE_TEAM_ID not set');
  }
  const enc = new TextEncoder();

  const files: Record<string, Uint8Array> = {};
  files['pass.json'] = enc.encode(JSON.stringify(buildPassJson(env, d)));
  for (const [name, b64] of Object.entries(PASS_ASSETS)) {
    files[name] = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  }

  const manifest: Record<string, string> = {};
  for (const [name, bytes] of Object.entries(files)) manifest[name] = sha1Hex(bytes);
  const manifestBytes = enc.encode(JSON.stringify(manifest));
  files['manifest.json'] = manifestBytes;

  files['signature'] = signManifest(manifestBytes, loadSigningMaterial(env));

  return zipSync(files, { level: 6 });
}
