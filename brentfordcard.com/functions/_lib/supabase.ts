// Minimal Supabase REST (PostgREST) client for the service role.
// Kept dependency-free so it bundles small on the Workers runtime.
import type { Env } from './env';

export class Supabase {
  private base: string;
  private key: string;
  constructor(env: Env) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase env not configured');
    }
    this.base = env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1';
    this.key = env.SUPABASE_SERVICE_ROLE_KEY;
  }

  private headers(extra: HeadersInit = {}): HeadersInit {
    return {
      apikey: this.key,
      Authorization: `Bearer ${this.key}`,
      'Content-Type': 'application/json',
      ...extra,
    };
  }

  // Insert (optionally upsert on a conflict target) and return the rows.
  async insert<T = any>(
    table: string,
    rows: Record<string, unknown> | Record<string, unknown>[],
    opts: { upsertOn?: string } = {},
  ): Promise<T[]> {
    const prefer = ['return=representation'];
    if (opts.upsertOn) prefer.push('resolution=merge-duplicates');
    const qs = opts.upsertOn ? `?on_conflict=${encodeURIComponent(opts.upsertOn)}` : '';
    const res = await fetch(`${this.base}/${table}${qs}`, {
      method: 'POST',
      headers: this.headers({ Prefer: prefer.join(',') }),
      body: JSON.stringify(rows),
    });
    return this.parse<T>(res, `insert ${table}`);
  }

  async update<T = any>(
    table: string,
    match: Record<string, string>,
    patch: Record<string, unknown>,
  ): Promise<T[]> {
    const res = await fetch(`${this.base}/${table}?${this.filter(match)}`, {
      method: 'PATCH',
      headers: this.headers({ Prefer: 'return=representation' }),
      body: JSON.stringify(patch),
    });
    return this.parse<T>(res, `update ${table}`);
  }

  async select<T = any>(
    table: string,
    match: Record<string, string>,
    columns = '*',
    limit?: number,
  ): Promise<T[]> {
    const params = new URLSearchParams();
    params.set('select', columns);
    for (const [k, v] of Object.entries(match)) params.set(k, `eq.${v}`);
    if (limit) params.set('limit', String(limit));
    const res = await fetch(`${this.base}/${table}?${params.toString()}`, {
      method: 'GET',
      headers: this.headers(),
    });
    return this.parse<T>(res, `select ${table}`);
  }

  async delete(table: string, match: Record<string, string>): Promise<void> {
    const res = await fetch(`${this.base}/${table}?${this.filter(match)}`, {
      method: 'DELETE',
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`delete ${table} failed: ${res.status} ${await res.text()}`);
  }

  private filter(match: Record<string, string>): string {
    return Object.entries(match)
      .map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`)
      .join('&');
  }

  private async parse<T>(res: Response, ctx: string): Promise<T[]> {
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Supabase ${ctx} failed: ${res.status} ${body}`);
    }
    if (res.status === 204) return [];
    return (await res.json()) as T[];
  }
}
