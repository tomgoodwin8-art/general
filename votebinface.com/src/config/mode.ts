// Operating-mode resolver (brief §1). Legal compliance is the top priority.
//
// AUTHORISED mode: the party's written authorisation is on file
// (SITE.authorisationRef is set). The statutory imprint names The Count
// Binface Party; the site drops "fan site / not affiliated" disclaimers and
// uses party framing.
//
// FAN mode (default while authorisationRef is empty): naming the party on the
// imprint without authorisation on file would be a false imprint and an
// offence, so the imprint instead names the real promoter and the site carries
// non-affiliation disclaimers. This is the legally-safe fallback and is what
// ships until the authorisation reference is filled in.
import { SITE } from '../data/facts';

export const isAuthorised: boolean = SITE.authorisationRef.trim() !== '';

// The statutory imprint string to render in the footer and /legal.
export const imprintLine: string = isAuthorised
  ? SITE.imprint
  : `Published and promoted by ${SITE.fanPromoterName}, ${SITE.fanPromoterAddress}`;

// Short affiliation statement used in the footer and /about.
export const affiliationLine: string = isAuthorised
  ? 'A Count Binface Party site. Official campaign HQ: countbinface.com.'
  : 'A fan-run supporter site. Not affiliated with, authorised or endorsed by Count Binface or The Count Binface Party. Official site: countbinface.com.';

export const modeLabel: string = isAuthorised ? 'authorised' : 'fan';
