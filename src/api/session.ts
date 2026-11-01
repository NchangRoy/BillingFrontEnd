import { OpenAPI } from '@/src/src2/api';
import { UpdatedSellerResponse } from '@/src/api/models/UpdatedSellerResponse';

const SELLER_STORAGE_KEY = 'seller';

export const getStoredSeller = (): UpdatedSellerResponse | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(SELLER_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UpdatedSellerResponse;
  } catch (e) {
    console.error('Failed to parse stored seller data', e);
    return null;
  }
};

export const clearSession = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SELLER_STORAGE_KEY);
};

export const updateStoredSellerProfileImage = (profileImageUrl: string) => {
  const seller = getStoredSeller();
  if (!seller) return;
  localStorage.setItem(SELLER_STORAGE_KEY, JSON.stringify({ ...seller, profileImageUrl }));
};

// The generated client (src/src2/api/core/OpenAPI.ts) hard-codes BASE to
// localhost:8080 — override it here so a deployed build can point at the
// real Billing backend via env var, same convention as MEDIA_FILE_URL/tokenService.
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Attaches the logged-in seller's access token to every request made
// through the generated API client (FactureService, BackOrderService, etc.).
OpenAPI.TOKEN = async () => getStoredSeller()?.accessToken ?? '';

// Billing's OrganizationFilter reads X-Organization-ID off every request to
// populate the reactive org context (used by Kernel-backed adapters like
// ClientController/AgencyController). Without this, those calls fail with
// "Organization ID absent du contexte réactif".
OpenAPI.HEADERS = async () => ({
  'X-Organization-ID': getStoredSeller()?.organizationId ?? '',
});

// Auto-logout on an expired session: Kernel tokens only last 15 minutes, and
// nothing previously caught a 401 mid-session — a page just sat there
// throwing "Unauthorized" toasts from the generated client's own ApiError
// instead of sending the user back to a fresh login (see login/page.tsx's
// 'expired=1' handling, which had no actual trigger wired up to it before
// this). Can't hook this into the generated client itself (src/src2/api is
// regenerated from the backend's OpenAPI doc — any hand-edit there is wiped
// out on the next `npm run generate:api`), so this wraps the global fetch
// instead: works for every call path (the generated client, pdfDownload.ts,
// getProducts, anything), survives regeneration, and is a no-op once logged
// out so it doesn't fire on the login page's own unauthenticated requests.
if (typeof window !== 'undefined' && !(window as any).__billingSessionExpiryHookInstalled) {
  (window as any).__billingSessionExpiryHookInstalled = true;
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const response = await nativeFetch(...args);
    const requestUrl = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url ?? '';
    const isOwnBackend = requestUrl.startsWith(OpenAPI.BASE);
    if (response.status === 401 && isOwnBackend && getStoredSeller()?.accessToken && !window.location.pathname.startsWith('/login')) {
      clearSession();
      window.location.href = '/login?expired=1';
    }
    return response;
  };
}
