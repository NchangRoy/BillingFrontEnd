import type { ClientResponse, FournisseurResponse } from '@/src/src2/api';
import { getStoredSeller } from '@/src/api/session';
import { isFullyOnline } from '../network/connectivity';
import {
  getLocalClients,
  getLocalFournisseurs,
  syncReferenceData,
} from '../sync/referenceSync';

export const getClientsOfflineFirst = async (
  fetcher: () => Promise<ClientResponse[]>
): Promise<ClientResponse[]> => {
  const seller = getStoredSeller();
  if (!seller?.organizationId) return [];

  const local = await getLocalClients(seller.organizationId);
  const online = await isFullyOnline();

  if (!online) {
    return local as unknown as ClientResponse[];
  }

  try {
    await syncReferenceData();
    const fresh = await getLocalClients(seller.organizationId);
    if (fresh.length > 0) return fresh as unknown as ClientResponse[];
    return await fetcher();
  } catch {
    if (local.length > 0) return local as unknown as ClientResponse[];
    return await fetcher().catch(() => []);
  }
};

export const getFournisseursOfflineFirst = async (
  fetcher: () => Promise<FournisseurResponse[]>
): Promise<FournisseurResponse[]> => {
  const seller = getStoredSeller();
  if (!seller?.organizationId) return [];

  const local = await getLocalFournisseurs(seller.organizationId);
  const online = await isFullyOnline();

  if (!online) {
    return local as unknown as FournisseurResponse[];
  }

  try {
    await syncReferenceData();
    const fresh = await getLocalFournisseurs(seller.organizationId);
    if (fresh.length > 0) return fresh as unknown as FournisseurResponse[];
    return await fetcher();
  } catch {
    if (local.length > 0) return local as unknown as FournisseurResponse[];
    return await fetcher().catch(() => []);
  }
};
