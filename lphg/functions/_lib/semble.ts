// Minimal Semble GraphQL client (brief §6.2). All calls are server-side only.
// Query shapes follow docs.semble.io; exact fields to be confirmed against the
// live sandbox at build time (open item §11: Semble sandbox credentials).
import type { Env } from './env';

async function sembleQuery<T>(env: Env, query: string, variables: Record<string, unknown>): Promise<T> {
  if (!env.SEMBLE_API_URL || !env.SEMBLE_API_KEY) {
    throw new Error('Semble not configured');
  }
  const res = await fetch(env.SEMBLE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Semble uses an API token header; confirm header name in sandbox.
      'x-token': env.SEMBLE_API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Semble ${res.status}`);
  const body = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length) throw new Error(body.errors.map((e) => e.message).join('; '));
  return body.data as T;
}

export interface Slot {
  start: string; // ISO
  end: string;
  practitionerId: string;
  practitionerName: string;
}

/** Query bookable slots for a booking type over a date range. */
export async function getAvailability(
  env: Env,
  bookingTypeId: string,
  from: string,
  to: string,
  practitionerId?: string
): Promise<Slot[]> {
  const query = /* GraphQL */ `
    query Availability($bookingTypeId: ID!, $from: Date!, $to: Date!, $practitionerId: ID) {
      availability(bookingTypeId: $bookingTypeId, start: $from, end: $to, practitionerId: $practitionerId) {
        start
        end
        practitioner { id name }
      }
    }`;
  const data = await sembleQuery<{
    availability: { start: string; end: string; practitioner: { id: string; name: string } }[];
  }>(env, query, { bookingTypeId, from, to, practitionerId: practitionerId ?? null });
  return (data.availability ?? []).map((s) => ({
    start: s.start,
    end: s.end,
    practitionerId: s.practitioner.id,
    practitionerName: s.practitioner.name,
  }));
}

export interface PatientInput {
  firstName: string;
  lastName: string;
  dob: string;
  sex: string;
  email: string;
  phone: string;
}

/** Match on email + DOB, else create (brief §6.2). Returns patient id. */
export async function findOrCreatePatient(env: Env, p: PatientInput): Promise<string> {
  const find = /* GraphQL */ `
    query FindPatient($email: String!, $dob: Date!) {
      patients(email: $email, dateOfBirth: $dob, first: 1) { data { id } }
    }`;
  const found = await sembleQuery<{ patients: { data: { id: string }[] } }>(env, find, {
    email: p.email,
    dob: p.dob,
  });
  if (found.patients?.data?.[0]?.id) return found.patients.data[0].id;

  const create = /* GraphQL */ `
    mutation CreatePatient($input: CreatePatientInput!) {
      createPatient(patientData: $input) { data { id } }
    }`;
  const created = await sembleQuery<{ createPatient: { data: { id: string } } }>(env, create, {
    input: {
      firstName: p.firstName,
      lastName: p.lastName,
      dateOfBirth: p.dob,
      gender: p.sex,
      email: p.email,
      phoneNumber: p.phone,
    },
  });
  return created.createPatient.data.id;
}

/** Create a pending booking; returns booking id. */
export async function createPendingBooking(
  env: Env,
  args: { bookingTypeId: string; patientId: string; start: string; practitionerId: string; reason?: string }
): Promise<string> {
  const mutation = /* GraphQL */ `
    mutation CreateBooking($input: CreateBookingInput!) {
      createBooking(bookingData: $input) { data { id } }
    }`;
  const data = await sembleQuery<{ createBooking: { data: { id: string } } }>(env, mutation, {
    input: {
      bookingType: args.bookingTypeId,
      patient: args.patientId,
      doctor: args.practitionerId,
      start: args.start,
      status: 'pending',
      comments: args.reason ?? '',
    },
  });
  return data.createBooking.data.id;
}

export async function updateBookingStatus(env: Env, bookingId: string, status: 'confirmed' | 'cancelled') {
  const mutation = /* GraphQL */ `
    mutation UpdateBooking($id: ID!, $status: String!) {
      updateBooking(id: $id, bookingData: { status: $status }) { data { id status } }
    }`;
  await sembleQuery(env, mutation, { id: bookingId, status });
}
