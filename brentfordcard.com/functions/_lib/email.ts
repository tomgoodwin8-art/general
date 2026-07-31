// Optional transactional email via Resend. If RESEND_API_KEY is unset this is
// a no-op, so the flow still works (the success page shows the wallet buttons).
import type { Env } from './env';
import { siteUrl } from './env';
import type { PassRow } from './provision';

export async function sendPassEmail(
  env: Env,
  request: Request,
  opts: { email: string; name?: string; pass: PassRow },
): Promise<void> {
  if (!env.RESEND_API_KEY) return;
  const origin = siteUrl(env, request);
  const walletUrl = `${origin}/wallet/?s=${opts.pass.serial_number}&t=${opts.pass.auth_token}`;
  const name = opts.name ? opts.name.split(' ')[0] : 'there';

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;color:#101614">
    <h1 style="font-size:20px;color:#2e4a43">You're a Brentford Card member</h1>
    <p>Hi ${escapeHtml(name)}, welcome to the Brentford Card. Add your pass to your phone wallet:</p>
    <p style="margin:24px 0">
      <a href="${walletUrl}" style="background:#b08d3e;color:#101614;text-decoration:none;padding:12px 20px;border-radius:4px;font-weight:bold">Add to Apple or Google Wallet</a>
    </p>
    <p style="color:#555">Card number: <strong>${escapeHtml(opts.pass.card_number)}</strong></p>
    <p style="color:#555;font-size:13px">Show the pass in store at participating businesses to redeem offers. Manage anything at <a href="${origin}/contact/">brentfordcard.com</a>.</p>
  </div>`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.EMAIL_FROM ?? 'Brentford Card <hello@brentfordcard.com>',
      to: [opts.email],
      subject: 'Your Brentford Card is ready',
      html,
    }),
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
