-- brentfordcard.com — membership + wallet-pass schema
-- Apply with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
--
-- Security model: the browser never talks to Supabase. Only the Cloudflare
-- Pages Functions do, using the SERVICE ROLE key (which bypasses RLS). RLS is
-- therefore enabled with NO anon/authenticated policies — a hard deny for any
-- client that isn't the service role. Do not expose the service role key.

create extension if not exists "pgcrypto";  -- gen_random_uuid()
create extension if not exists "citext";    -- case-insensitive email

-- updated_at helper -----------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- members ---------------------------------------------------------------------
create table if not exists public.members (
  id                  uuid primary key default gen_random_uuid(),
  email               citext not null unique,
  name                text,
  stripe_customer_id  text,
  status              text not null default 'active'
                        check (status in ('active','cancelled','refunded')),
  founding            boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create trigger members_touch before update on public.members
  for each row execute function public.touch_updated_at();

-- orders ----------------------------------------------------------------------
create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  member_id             uuid references public.members(id) on delete set null,
  stripe_session_id     text unique,
  stripe_payment_intent text,
  amount_total          integer,          -- minor units (pence)
  currency              text default 'gbp',
  status                text not null default 'paid'
                          check (status in ('paid','refunded','failed')),
  created_at            timestamptz not null default now()
);
create index if not exists orders_member_idx on public.orders(member_id);

-- passes ----------------------------------------------------------------------
-- One active pass per member. serial_number + auth_token are the Apple Wallet
-- web-service credentials; card_number is the human/QR-facing membership id.
create table if not exists public.passes (
  id               uuid primary key default gen_random_uuid(),
  member_id        uuid not null references public.members(id) on delete cascade,
  serial_number    text not null unique,
  auth_token       text not null,
  card_number      text not null unique,
  tier             text not null default 'founding'
                     check (tier in ('founding','member')),
  status           text not null default 'active'
                     check (status in ('active','cancelled','expired')),
  issued_on        date not null default (now() at time zone 'utc')::date,
  expires_on       date not null default ((now() at time zone 'utc')::date + interval '1 year'),
  google_object_id text,
  apple_updated_at timestamptz not null default now(), -- bumped on every change
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists passes_member_idx on public.passes(member_id);
create trigger passes_touch before update on public.passes
  for each row execute function public.touch_updated_at();

-- Apple Wallet device registrations (for push-updating passes) -----------------
create table if not exists public.pass_devices (
  device_library_id text not null,
  pass_serial       text not null references public.passes(serial_number) on delete cascade,
  push_token        text not null,
  pass_type_id      text not null,
  created_at        timestamptz not null default now(),
  primary key (device_library_id, pass_serial)
);
create index if not exists pass_devices_serial_idx on public.pass_devices(pass_serial);

-- Offer redemptions (optional analytics; logged when a business scans a pass) --
create table if not exists public.redemptions (
  id            uuid primary key default gen_random_uuid(),
  pass_id       uuid references public.passes(id) on delete set null,
  business_slug text,
  note          text,
  created_at    timestamptz not null default now()
);
create index if not exists redemptions_pass_idx on public.redemptions(pass_id);

-- Lock everything down: RLS on, zero policies => only service role gets in. ----
alter table public.members     enable row level security;
alter table public.orders      enable row level security;
alter table public.passes      enable row level security;
alter table public.pass_devices enable row level security;
alter table public.redemptions enable row level security;

-- Convenience view: a member with their current active pass -------------------
create or replace view public.member_passes as
  select m.id as member_id, m.email, m.name, m.founding, m.status as member_status,
         p.serial_number, p.card_number, p.tier, p.status as pass_status,
         p.issued_on, p.expires_on
  from public.members m
  join public.passes p on p.member_id = m.id;
