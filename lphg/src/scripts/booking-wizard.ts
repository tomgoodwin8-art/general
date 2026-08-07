/**
 * LPHG booking wizard (brief §6.1). Vanilla TS island, loaded only on /book/.
 * Five steps, progress bar, back-navigable, state in memory only (no PII in
 * storage or URLs, §6.3). Talks to Pages Functions for Semble/Stripe.
 */

interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  duration: string;
  centre: string;
  preparation: string;
}
interface Slot {
  start: string;
  end: string;
  practitionerId: string;
  practitionerName: string;
}

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector(sel) as T | null;
const catalog: CatalogItem[] = JSON.parse($('#wiz-catalog')?.textContent || '[]');

const state = {
  step: 1,
  service: null as CatalogItem | null,
  slot: null as Slot | null,
  weekOffset: 0,
  details: null as Record<string, string> | null,
  bookingRef: null as string | null,
};

function track(event: string, params: Record<string, unknown> = {}) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer?.push({ event, ...params });
}

function showError(msg: string | null) {
  const el = $('#wiz-error');
  if (!el) return;
  el.textContent = msg || '';
  el.classList.toggle('hidden', !msg);
}

/* ---------- step rendering ---------- */

function render() {
  document.querySelectorAll<HTMLElement>('.wiz-step').forEach((s) => {
    s.classList.toggle('hidden', Number(s.dataset.step) !== state.step);
  });
  document.querySelectorAll<HTMLElement>('#wiz-progress [data-step-label]').forEach((li) => {
    const n = Number(li.dataset.stepLabel);
    const dot = li.querySelector('.step-dot');
    if (!dot) return;
    dot.classList.toggle('bg-brand-primary', n <= state.step);
    dot.classList.toggle('text-white', n <= state.step);
    dot.classList.toggle('border-brand-primary', n <= state.step);
  });
  const back = $('#wiz-back') as HTMLButtonElement;
  const next = $('#wiz-next') as HTMLButtonElement;
  if (back) back.disabled = state.step === 1;
  if (next) {
    next.classList.toggle('hidden', state.step >= 4);
    next.textContent = state.step === 3 ? 'Continue to payment' : 'Continue';
  }
  showError(null);
}

/* ---------- step 1: service ---------- */

function renderServices(filter = '') {
  const list = $('#svc-list');
  if (!list) return;
  const q = filter.trim().toLowerCase();
  const matches = catalog.filter((c) => !q || c.title.toLowerCase().includes(q) || c.centre.toLowerCase().includes(q));
  const groups = new Map<string, CatalogItem[]>();
  for (const item of matches) {
    if (!groups.has(item.centre)) groups.set(item.centre, []);
    groups.get(item.centre)!.push(item);
  }
  list.innerHTML = '';
  if (!matches.length) {
    list.innerHTML = '<p class="text-sm text-brand-muted">No services match your search.</p>';
    return;
  }
  for (const [centre, items] of groups) {
    const h = document.createElement('div');
    h.innerHTML = `<p class="text-xs font-semibold uppercase tracking-wide text-brand-muted">${centre}</p>`;
    const ul = document.createElement('div');
    ul.className = 'mt-2 space-y-2';
    for (const item of items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className =
        'flex w-full items-center justify-between rounded-card border border-brand-line bg-white px-4 py-3 text-left text-sm hover:border-brand-primary';
      btn.innerHTML = `<span><span class="font-medium">${item.title}</span><span class="block text-xs text-brand-muted">${item.duration}</span></span><span class="font-semibold text-brand-primary">£${item.price}</span>`;
      btn.addEventListener('click', () => selectService(item));
      ul.appendChild(btn);
    }
    h.appendChild(ul);
    list.appendChild(h);
  }
}

function selectService(item: CatalogItem) {
  state.service = item;
  state.slot = null;
  state.weekOffset = 0;
  track('view_service', { service: item.slug });
  goTo(2);
}

/* ---------- step 2: availability ---------- */

function startOfWeek(offset: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset * 7);
  return d;
}

async function loadAvailability() {
  const grid = $('#slot-grid');
  const summary = $('#svc-summary');
  if (!grid || !state.service) return;
  if (summary) summary.textContent = `${state.service.title} · £${state.service.price} · ${state.service.duration}`;

  const from = startOfWeek(state.weekOffset);
  const to = new Date(from);
  to.setDate(to.getDate() + 6);
  const label = $('#week-label');
  if (label) label.textContent = `${from.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${to.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
  const prev = $('#week-prev') as HTMLButtonElement;
  if (prev) prev.disabled = state.weekOffset === 0;

  grid.innerHTML = '<p class="text-sm text-brand-muted">Loading availability…</p>';
  try {
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingTypeId: state.service.id, from: from.toISOString(), to: to.toISOString() }),
    });
    const data = (await res.json()) as { slots?: Slot[] };
    renderSlots(data.slots || []);
  } catch {
    grid.innerHTML = '<p class="text-sm text-amber-800">Could not load availability. Please try another week or call us.</p>';
  }
}

function renderSlots(slots: Slot[]) {
  const grid = $('#slot-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (!slots.length) {
    grid.innerHTML = '<p class="text-sm text-brand-muted">No slots this week. Try a later week.</p>';
    return;
  }
  const byDay = new Map<string, Slot[]>();
  for (const s of slots) {
    const day = new Date(s.start).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(s);
  }
  for (const [day, daySlots] of byDay) {
    const wrap = document.createElement('div');
    wrap.innerHTML = `<p class="text-sm font-medium">${day}</p>`;
    const row = document.createElement('div');
    row.className = 'mt-2 flex flex-wrap gap-2';
    for (const s of daySlots) {
      const t = new Date(s.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rounded-full border border-brand-line px-3 py-1.5 text-sm hover:border-brand-primary hover:bg-brand-surface';
      b.textContent = t;
      b.addEventListener('click', () => {
        state.slot = s;
        track('select_slot', { service: state.service?.slug });
        goTo(3);
      });
      row.appendChild(b);
    }
    wrap.appendChild(row);
    grid.appendChild(wrap);
  }
}

/* ---------- step 3: details ---------- */

function collectDetails(): Record<string, string> | null {
  const form = $('#details-form') as HTMLFormElement;
  if (!form) return null;
  if (!form.reportValidity()) return null;
  const fd = new FormData(form);
  const privacy = fd.get('privacy') === 'on';
  if (!privacy) {
    showError('Please accept the privacy policy to continue.');
    return null;
  }
  return {
    firstName: String(fd.get('firstName') || ''),
    lastName: String(fd.get('lastName') || ''),
    dob: String(fd.get('dob') || ''),
    sex: String(fd.get('sex') || ''),
    email: String(fd.get('email') || ''),
    phone: String(fd.get('phone') || ''),
    reason: String(fd.get('reason') || ''),
    privacy: privacy ? 'yes' : 'no',
    comms: fd.get('comms') === 'on' ? 'yes' : 'no',
  };
}

/* ---------- step 4: payment ---------- */

async function startPayment() {
  if (!state.service || !state.slot || !state.details) return;
  const summary = $('#order-summary');
  if (summary) {
    const when = new Date(state.slot.start).toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    summary.innerHTML = `<div class="flex justify-between"><span>${state.service.title}</span><span class="font-semibold">£${state.service.price}</span></div><div class="mt-1 text-brand-muted">${when} · ${state.slot.practitionerName}</div>`;
  }
  track('add_payment_info', { service: state.service.slug, value: state.service.price });

  let data: {
    configured: boolean;
    bookingId: string;
    client_secret: string | null;
    publishableKey: string | null;
    message?: string;
  };
  try {
    const res = await fetch('/api/booking/hold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingTypeId: state.service.id,
        start: state.slot.start,
        practitionerId: state.slot.practitionerId,
        patient: state.details,
        consent: { privacy: state.details.privacy === 'yes', comms: state.details.comms === 'yes' },
      }),
    });
    data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Could not hold your slot.');
  } catch (err) {
    showError(String((err as Error).message || err));
    return;
  }
  state.bookingRef = data.bookingId;

  if (data.client_secret && data.publishableKey) {
    await mountStripe(data.publishableKey, data.client_secret);
  } else {
    // Sandbox: no live payment processor wired yet.
    const note = $('#sandbox-note');
    if (note) {
      note.classList.remove('hidden');
      note.innerHTML = `${data.message || 'Sandbox mode.'} <button type="button" id="sandbox-confirm" class="mt-2 block rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white">Confirm booking (sandbox)</button>`;
      $('#sandbox-confirm')?.addEventListener('click', () => confirmDone());
    }
  }
}

async function mountStripe(pk: string, clientSecret: string) {
  await loadScript('https://js.stripe.com/v3/');
  const stripe = (window as unknown as { Stripe: (k: string) => any }).Stripe(pk);
  const elements = stripe.elements({ clientSecret });
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');

  const payBtn = document.createElement('button');
  payBtn.type = 'button';
  payBtn.className = 'mt-4 w-full rounded-full bg-brand-primary px-6 py-3 text-sm font-semibold text-white';
  payBtn.textContent = `Pay £${state.service?.price} and confirm`;
  $('#payment-element')?.after(payBtn);

  payBtn.addEventListener('click', async () => {
    payBtn.disabled = true;
    payBtn.textContent = 'Processing…';
    const { error } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
    if (error) {
      showError(error.message || 'Payment failed.');
      payBtn.disabled = false;
      payBtn.textContent = `Pay £${state.service?.price} and confirm`;
      return;
    }
    confirmDone();
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

/* ---------- step 5: confirmation ---------- */

function confirmDone() {
  if (!state.service || !state.slot) return;
  track('purchase', {
    transaction_id: state.bookingRef,
    value: state.service.price,
    currency: 'GBP',
    items: [{ item_id: state.service.slug, item_name: state.service.title }],
  });
  const ref = $('#confirm-ref');
  if (ref) ref.textContent = `Your reference: ${(state.bookingRef || '').toUpperCase()}`;
  const when = $('#confirm-when');
  if (when) when.textContent = new Date(state.slot.start).toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const prep = $('#confirm-prep');
  if (prep) prep.innerHTML = `<p class="font-medium">How to prepare</p><p class="text-brand-muted">${state.service.preparation}</p>`;
  wireCalendarLinks();
  goTo(5);
}

function wireCalendarLinks() {
  if (!state.service || !state.slot) return;
  const start = new Date(state.slot.start);
  const end = new Date(state.slot.end || new Date(start.getTime() + 30 * 60000));
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const title = `${state.service.title} — LPHG`;
  const details = `Booking reference ${state.bookingRef}. ${state.service.preparation}`;
  const location = '11 Devonshire Place, London W1';

  const gcal = $('#cal-google') as HTMLAnchorElement;
  if (gcal) gcal.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//LPHG//Booking//EN', 'BEGIN:VEVENT',
    `UID:${state.bookingRef}@lphg`, `DTSTAMP:${fmt(new Date())}`, `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`, `DESCRIPTION:${details}`, `LOCATION:${location}`, 'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  const icsLink = $('#cal-ics') as HTMLAnchorElement;
  if (icsLink) icsLink.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
}

/* ---------- navigation ---------- */

function goTo(step: number) {
  state.step = step;
  render();
  if (step === 2) loadAvailability();
  if (step === 4) startPayment();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function onNext() {
  if (state.step === 1 && !state.service) return showError('Please choose a service.');
  if (state.step === 2) {
    if (!state.slot) return showError('Please choose a time.');
    return goTo(3);
  }
  if (state.step === 3) {
    const details = collectDetails();
    if (!details) return;
    state.details = details;
    return goTo(4);
  }
  goTo(Math.min(state.step + 1, 5));
}

/* ---------- init ---------- */

function init() {
  render();
  renderServices();
  $('#svc-search')?.addEventListener('input', (e) => renderServices((e.target as HTMLInputElement).value));
  $('#wiz-next')?.addEventListener('click', onNext);
  $('#wiz-back')?.addEventListener('click', () => goTo(Math.max(1, state.step - 1)));
  $('#week-prev')?.addEventListener('click', () => { state.weekOffset = Math.max(0, state.weekOffset - 1); loadAvailability(); });
  $('#week-next')?.addEventListener('click', () => { state.weekOffset += 1; loadAvailability(); });

  // Deep link: ?service={bookingTypeId} preselects and skips step 1 (§6).
  const param = new URLSearchParams(location.search).get('service');
  if (param) {
    const match = catalog.find((c) => c.id === param || c.slug === param);
    if (match) {
      state.service = match;
      track('begin_booking', { service: match.slug });
      goTo(2);
      return;
    }
  }
  track('begin_booking', {});
  goTo(1);
}

init();
