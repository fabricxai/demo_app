/** Payload expected by the demo-requests edge function */
export interface DemoRequestPayload {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  companySize: string;
  industry: string;
  location: string;
  useCase: string;
  hearAboutUs: string;
  notes: string;
  requestedAt: string;
}

const DEFAULT_DEMO_URL =
  'https://elznbletkunibhicbizb.supabase.co/functions/v1/make-server-1f923fcd/demo-requests/submit';

const DEFAULT_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsem5ibGV0a3VuaWJoaWNiaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDM3NjYsImV4cCI6MjA3NzIxOTc2Nn0.4HppRI5vcRf2zxjMKBPYghjVL0aYDCniniaDpqOTnvI';

export function getDemoRequestEndpoint(): string {
  return import.meta.env.VITE_DEMO_REQUEST_URL || DEFAULT_DEMO_URL;
}

export function getDemoRequestAnonKey(): string {
  return import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON;
}

/** Build a valid payload when only a subset of fields was collected (e.g. mobile). */
export function buildDemoPayload(partial: {
  fullName: string;
  email: string;
  companyName: string;
  phone?: string;
  jobTitle?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  useCase?: string;
  hearAboutUs?: string;
  notes?: string;
}): DemoRequestPayload {
  return {
    fullName: partial.fullName.trim(),
    email: partial.email.trim(),
    phone: (partial.phone || '').trim() || '—',
    companyName: partial.companyName.trim(),
    jobTitle: partial.jobTitle?.trim() || '—',
    companySize: partial.companySize?.trim() || '—',
    industry: partial.industry?.trim() || '—',
    location: partial.location?.trim() || '—',
    useCase: partial.useCase?.trim() || 'Demo / workspace access request',
    hearAboutUs: partial.hearAboutUs?.trim() || '—',
    notes: partial.notes?.trim() || '',
    requestedAt: new Date().toISOString(),
  };
}

export async function submitDemoRequest(payload: DemoRequestPayload): Promise<Response> {
  return fetch(getDemoRequestEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getDemoRequestAnonKey()}`,
    },
    body: JSON.stringify(payload),
  });
}
