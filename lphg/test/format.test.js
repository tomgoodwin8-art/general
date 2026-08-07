import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gbp, priceFrom, sumIncludes, readingTime, slugify } from '../src/lib/format.ts';

test('gbp formats whole pounds with thousands separator', () => {
  assert.equal(gbp(395), '£395');
  assert.equal(gbp(1300), '£1,300');
  assert.equal(gbp(0), '£0');
});

test('gbp rounds and rejects non-finite', () => {
  assert.equal(gbp(395.4), '£395');
  assert.throws(() => gbp(Infinity), RangeError);
});

test('priceFrom prefixes From', () => {
  assert.equal(priceFrom(295), 'From £295');
});

test('sumIncludes totals itemised values', () => {
  assert.equal(sumIncludes([{ value: 150 }, { value: 245 }, { value: 100 }]), 495);
  assert.equal(sumIncludes([]), 0);
});

test('readingTime is at least 1 minute', () => {
  assert.equal(readingTime(0), 1);
  assert.equal(readingTime(400), 2);
  assert.equal(readingTime(1900), 10);
});

test('slugify produces anchor-safe ids', () => {
  assert.equal(slugify('What it shows'), 'what-it-shows');
  assert.equal(slugify('Ultrasound vs. CT/MRI'), 'ultrasound-vs-ctmri');
});
