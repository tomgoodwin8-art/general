/** Pure formatting helpers (brief §2: utilities pure and tested). */

/** Whole-pound GBP price, e.g. 395 -> "£395". Prices are always whole pounds. */
export function gbp(amount: number): string {
  if (!Number.isFinite(amount)) throw new RangeError('gbp: amount must be finite');
  return '£' + Math.round(amount).toLocaleString('en-GB');
}

/** "From £295" helper for hero price-from labels. */
export function priceFrom(amount: number): string {
  return `From ${gbp(amount)}`;
}

/** Sum of itemised package inclusions (for the struck-through à la carte total). */
export function sumIncludes(items: { value: number }[]): number {
  return items.reduce((total, item) => total + item.value, 0);
}

/** Estimate reading time in minutes from a word count (200 wpm, min 1). */
export function readingTime(words: number): number {
  return Math.max(1, Math.round(words / 200));
}

/** en-GB long date, e.g. "7 August 2026". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Slugify for anchor ids from headings. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
