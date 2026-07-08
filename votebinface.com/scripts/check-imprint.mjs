// Pre-build legal check (brief §1, §10). Runs before every build.
//
// Rules, in priority order (legal compliance first):
//  1. SITE.imprint must never be empty. Empty imprint => build FAILS. Always.
//  2. SITE.authorisationRef gates AUTHORISED mode:
//       - If set: authorised mode. Party may be named on the imprint.
//       - If empty: legally-safe FAN mode is used instead (the party is NOT
//         named on the imprint). The build is allowed so fan mode can ship.
//  3. An authorised deploy MUST have authorisationRef. Set REQUIRE_AUTHORISATION=1
//     (CI / `npm run deploy`) to make an empty authorisationRef FAIL the build.
//  4. A fan-mode public deploy MUST have real promoter details (no {{TOKENS}}).
//     Under REQUIRE_AUTHORISATION=1 unresolved tokens FAIL the build.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'src', 'data', 'facts.ts'), 'utf8');

function field(name) {
  const m = src.match(new RegExp(`${name}:\\s*(['"\`])([\\s\\S]*?)\\1`));
  return m ? m[2] : null;
}

const imprint = field('imprint');
const authorisationRef = field('authorisationRef');
const fanName = field('fanPromoterName') || '';
const fanAddress = field('fanPromoterAddress') || '';

const strict = process.env.REQUIRE_AUTHORISATION === '1';
const errors = [];
const warnings = [];

if (!imprint || !imprint.trim()) {
  errors.push('SITE.imprint is empty. The statutory imprint is mandatory on every page.');
}

const authorised = !!(authorisationRef && authorisationRef.trim());

if (authorised) {
  console.log('[imprint] Operating mode: AUTHORISED (party authorisation on file).');
} else {
  const msg =
    'SITE.authorisationRef is empty: site runs in FAN mode (party NOT named on imprint).';
  if (strict) errors.push(msg + ' An authorised deploy requires authorisationRef.');
  else warnings.push(msg);

  const hasTokens = /\{\{.*?\}\}/.test(fanName) || /\{\{.*?\}\}/.test(fanAddress);
  if (hasTokens) {
    const tmsg = 'Fan-mode promoter still contains {{TOKENS}}. Replace with a real name and postal address before a public deploy.';
    if (strict) errors.push(tmsg);
    else warnings.push(tmsg);
  }
}

for (const w of warnings) console.warn('[imprint] WARNING: ' + w);

if (errors.length) {
  console.error('\n[imprint] BUILD BLOCKED:');
  for (const e of errors) console.error('  - ' + e);
  console.error('');
  process.exit(1);
}

console.log('[imprint] Imprint check passed.');
