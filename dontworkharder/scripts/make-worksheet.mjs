// Generates the "See" week-audit worksheet as a clean one-page PDF.
// Run: node scripts/make-worksheet.mjs  ->  public/downloads/week-audit.pdf
import PDFDocument from 'pdfkit';
import { createWriteStream, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '../public/downloads/week-audit.pdf');
mkdirSync(dirname(out), { recursive: true });

const INK = '#16130f';
const SOFT = '#4a443c';
const ACCENT = '#6d2a32';
const RULE = '#d8cfc0';

const doc = new PDFDocument({ size: 'A4', margin: 48, info: {
  Title: 'The Week Audit Worksheet',
  Author: 'Don’t Work Harder',
} });
doc.pipe(createWriteStream(out));

const left = doc.page.margins.left;
const right = doc.page.width - doc.page.margins.right;
const width = right - left;

// Header
doc.fillColor(ACCENT).fontSize(9).font('Helvetica-Bold')
  .text('DON’T WORK HARDER  ·  MOVE ONE: SEE', left, 44, { characterSpacing: 1 });
doc.fillColor(INK).font('Times-Bold').fontSize(26)
  .text('The Week Audit', left, 62);
doc.fillColor(SOFT).font('Helvetica').fontSize(10.5)
  .text(
    'You cannot reclaim a week you have never measured. For five working days, log what you actually do in thirty-minute blocks. Be specific: not “admin” but the real task. Then tag each block. By Friday the pattern is undeniable.',
    left, 96, { width, lineGap: 2 },
  );

// Legend
let y = 150;
doc.fillColor(INK).font('Helvetica-Bold').fontSize(9.5).text('TAG EACH BLOCK', left, y, { characterSpacing: 0.5 });
y += 15;
const tags = [
  ['D', 'Deep work (high value, needs focus)'],
  ['S', 'Shallow work (necessary, low value)'],
  ['C', 'Coordination (meetings, email, status)'],
  ['X', 'Needless (should not exist at all)'],
];
doc.font('Helvetica').fontSize(9.5);
let tx = left;
for (const [k, label] of tags) {
  doc.fillColor(ACCENT).font('Helvetica-Bold').text(k + '  ', tx, y, { continued: true });
  doc.fillColor(SOFT).font('Helvetica').text(label, { continued: false });
  tx += 130;
  if (k === 'S') { y += 14; tx = left; }
}

// Table
y += 26;
const rows = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const dayColW = 46;
const tagColW = 60;
const taskColW = width - dayColW - tagColW;

function tableHeader(yy) {
  doc.fillColor(INK).font('Helvetica-Bold').fontSize(9);
  doc.text('DAY', left, yy);
  doc.text('WHAT YOU ACTUALLY DID (30-MIN BLOCKS)', left + dayColW, yy);
  doc.text('TAG', left + dayColW + taskColW, yy);
  doc.moveTo(left, yy + 13).lineTo(right, yy + 13).strokeColor(INK).lineWidth(1).stroke();
}
tableHeader(y);
y += 20;

doc.fontSize(9).font('Helvetica');
const rowH = 26;
const blocksPerDay = 2; // two writable lines per labelled day keeps it to one page
for (const day of rows) {
  for (let b = 0; b < blocksPerDay; b++) {
    if (b === 0) {
      doc.fillColor(INK).font('Helvetica-Bold').fontSize(10).text(day, left, y + 7);
    }
    // task underline
    doc.strokeColor(RULE).lineWidth(0.8)
      .moveTo(left + dayColW, y + rowH - 6).lineTo(left + dayColW + taskColW - 12, y + rowH - 6).stroke();
    // tag box
    doc.strokeColor(RULE).lineWidth(0.8)
      .rect(left + dayColW + taskColW, y + 2, tagColW - 6, rowH - 8).stroke();
    y += rowH;
  }
  doc.strokeColor(RULE).lineWidth(0.5).moveTo(left, y).lineTo(right, y).stroke();
}

// Footer prompt
y += 16;
doc.fillColor(INK).font('Times-Bold').fontSize(13).text('At the end of the week', left, y);
y += 20;
doc.fillColor(SOFT).font('Helvetica').fontSize(10);
const prompts = [
  'Total your X blocks. That is the work to Shed first.',
  'Total your C blocks. How much of your week is pure coordination?',
  'Circle the one task you dread most. It is often the best candidate to Shift to AI.',
];
for (const p of prompts) {
  doc.fillColor(ACCENT).font('Helvetica-Bold').text('•  ', left, y, { continued: true });
  doc.fillColor(SOFT).font('Helvetica').text(p);
  y += 16;
}

y += 10;
doc.fillColor(SOFT).fontSize(8.5).font('Helvetica')
  .text('dontworkharder.com  ·  The free 5-day course walks you through all five moves.', left, y);

doc.end();
console.log('Wrote', out);
