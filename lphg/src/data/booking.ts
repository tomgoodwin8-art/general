/**
 * Semble bookingTypeId map (brief §6.2 / §4.3).
 *
 * Each service page carries `sembleBookingTypeId` in frontmatter; BookCTA
 * deep-links the wizard with `?service={id}`. The real IDs come from LPU's
 * Semble account (open item §11 — "bookingTypeId map"). Until Tom supplies
 * them, frontmatter uses stable placeholder tokens of the form `LPHG-XXXX`
 * and the wizard treats an unknown id as "not yet bookable online" (shows the
 * call-to-book fallback rather than a dead end).
 */

/** True once real Semble IDs replace the placeholders. */
export const SEMBLE_IDS_CONFIGURED = false;

/** Placeholder detector: real Semble ids are numeric/opaque, not `LPHG-*`. */
export function isPlaceholderBookingId(id: string | undefined | null): boolean {
  return !id || /^LPHG-/i.test(id);
}
