import { getPortalSession, clearPortalSession, PortalOrganizationOption } from './portalSession';

// Deliberately NOT the generated OpenAPI client — that singleton's TOKEN/HEADERS
// are already claimed by the seller session (src/api/session.ts). The portal
// is a separate auth realm (its own JWT, its own login), so it gets its own
// tiny fetch wrapper instead of fighting over the same global config.
const BASE_URL = 'http://localhost:8080';

async function portalFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const session = getPortalSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`;
  }
  // No X-Organization-ID header anymore: an account can have a record in
  // more than one org, so the backend resolves every one of them itself
  // per request (see PortalIdentityResolver) rather than being scoped to
  // a single client-supplied org.

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Kernel access tokens only last 15 minutes — a session left open across a
  // long testing/review session routinely outlives its token, which then
  // fails every subsequent call with 401. Surfacing that as a generic
  // "failed to load" error is confusing, so send the user back to a fresh
  // login instead of leaving them staring at a broken page.
  if (res.status === 401) {
    clearPortalSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/portal/login?expired=1';
    }
    throw new Error('Your session has expired. Please sign in again.');
  }

  // Several endpoints (accept/reject, etc.) reply 200 with an empty body,
  // not 204 — res.json() on an empty body throws "Unexpected end of JSON
  // input", so read as text first and only parse when there's something there.
  const text = await res.text();
  const body = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    throw new Error((body && body.message) || `Request failed: ${res.status}`);
  }
  return body as T;
}

export interface PortalAuthResponse {
  accessToken: string;
  email: string;
  name: string;
  // Every organization this account has a customer/supplier record in — an
  // actor can legitimately have several (a third-party record's id is
  // per-org, Kernel has no cross-org concept). No "pick one" step: documents
  // are aggregated across all of them, the frontend labels each row by org.
  organizations: PortalOrganizationOption[];
}

export const PortalApi = {
  // A person's normal Kernel actor login (email + password) — same identity
  // system as sellers, not a separate portal-only account.
  login: (email: string, password: string) =>
    portalFetch<PortalAuthResponse>('/api/portal/auth/login', {
      method: 'POST',
      body: JSON.stringify({ principal: email, password }),
    }),

  getQuotations: () => portalFetch<any[]>('/api/portal/quotations'),
  getInvoices: () => portalFetch<any[]>('/api/portal/invoices'),
  getPurchaseOrders: () => portalFetch<any[]>('/api/portal/purchase-orders'),
  getSupplierInvoices: () => portalFetch<any[]>('/api/portal/supplier-invoices'),

  acceptQuotation: (id: string) => portalFetch<void>(`/api/portal/quotations/${id}/accept`, { method: 'POST' }),
  rejectQuotation: (id: string) => portalFetch<void>(`/api/portal/quotations/${id}/reject`, { method: 'POST' }),
  acceptPurchaseOrder: (id: string) => portalFetch<void>(`/api/portal/purchase-orders/${id}/accept`, { method: 'POST' }),
  rejectPurchaseOrder: (id: string) => portalFetch<void>(`/api/portal/purchase-orders/${id}/reject`, { method: 'POST' }),

  // Org branding for the print preview (name/logo/address). Not
  // /api/organizations/{id} — that's the account app's own unused local
  // org table and 500s for real Kernel-backed orgs. This resolves branding
  // the same way the seller-login flow does (denormalized onto a Seller row).
  getOrganizationBranding: () => portalFetch<any>('/api/portal/organization'),

  // GET /api/products/organization/{id} has no auth gate (same as
  // /api/organizations/{id}/branding), so it's fetched directly rather than
  // through portalFetch's Bearer-token wrapper.
  getProducts: (organizationId: string) =>
    fetch(`${BASE_URL}/api/products/organization/${organizationId}`).then((res) => {
      if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
      return res.json();
    }),

  // Own client record (allowedSaleSizes, name, etc.) — getClientById by
  // itself is broken for some clients (a pre-existing Kernel-lookup bug), so
  // this goes through the account app's own getAllClients-then-filter route.
  // organizationId picks which of the account's client records to return
  // (they differ per org — code, credit limit, allowed sale sizes, etc.).
  getMyClientInfo: (organizationId?: string) =>
    portalFetch<any>(`/api/portal/me/client${organizationId ? `?organizationId=${organizationId}` : ''}`),

  getQuotationProposals: () => portalFetch<any[]>('/api/portal/quotation-proposals'),
  createQuotationProposal: (payload: any) =>
    portalFetch<any>('/api/portal/quotation-proposals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
