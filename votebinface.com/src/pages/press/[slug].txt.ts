import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { imprintLine } from '../../config/mode';

export async function getStaticPaths() {
  const releases = (await getCollection('press')).filter((p) => !p.data.draft);
  return releases.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

export const GET: APIRoute = ({ props }) => {
  const { entry } = props as { entry: any };
  const date = entry.data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  // Strip light markdown from the body for a clean plain-text release.
  const body = (entry.body || '')
    .replace(/^### (.*)$/gm, (_m: string, t: string) => t.toUpperCase())
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)')
    .trim();

  const text = [
    'PRESS RELEASE',
    date,
    '',
    entry.data.title.toUpperCase(),
    '',
    entry.data.standfirst,
    '',
    body,
    '',
    '---',
    `Quote attributable to: ${entry.data.spokesperson}`,
    `Press contact: ${entry.data.contactEmail}`,
    imprintLine,
  ].join('\n');

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
