const PORTAL_STORAGE_KEY = 'portalSession';

export interface PortalOrganizationOption {
  organizationId: string;
  organizationName: string;
  clientId: string;
  roles: ('CUSTOMER' | 'SUPPLIER')[];
}

export interface PortalSession {
  accessToken: string;
  email: string;
  name: string;
  // An actor can have a customer/supplier record in more than one
  // organization (a third-party record's id is per-org) — documents are
  // aggregated across all of them, not scoped to a single "selected" org.
  organizations: PortalOrganizationOption[];
}

export const getPortalSession = (): PortalSession | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PORTAL_STORAGE_KEY);
  if (!stored) return null;
  try {
    const session = JSON.parse(stored) as PortalSession;
    // Reject sessions from before the multi-org rework (old shape had a
    // single clientId/organizationId/roles, no organizations array) —
    // treat as logged-out rather than crashing on the missing field.
    if (!Array.isArray(session.organizations)) {
      localStorage.removeItem(PORTAL_STORAGE_KEY);
      return null;
    }
    return session;
  } catch (e) {
    console.error('Failed to parse stored portal session', e);
    return null;
  }
};

export const setPortalSession = (session: PortalSession) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(session));
};

export const clearPortalSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PORTAL_STORAGE_KEY);
};

// Union of roles across every org this account has a record in — used to
// decide which nav items/dashboard sections to show at all.
export const getPortalRoles = (session: PortalSession | null): ('CUSTOMER' | 'SUPPLIER')[] => {
  if (!session) return [];
  const roles = new Set<'CUSTOMER' | 'SUPPLIER'>();
  session.organizations.forEach((org) => org.roles.forEach((r) => roles.add(r)));
  return Array.from(roles);
};

// Looks up an org's display name from a document row's organizationId — every
// document response already carries its own organizationId field.
export const getOrganizationName = (session: PortalSession | null, organizationId: string | undefined | null): string => {
  if (!session || !organizationId) return '—';
  return session.organizations.find((o) => o.organizationId === organizationId)?.organizationName ?? '—';
};
