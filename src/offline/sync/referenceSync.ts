import {
  ClientsService,
  FournisseursService,
  TaxeService,
  type ClientResponse,
  type FournisseurResponse,
  type TaxeResponse,
} from '@/src/src2/api';
import { getStoredSeller } from '@/src/api/session';
import { offlineDb } from '../db/database';
import type { LocalTaxe, LocalTiersClient, LocalTiersFournisseur } from '../db/types';
import { isFullyOnline } from '../network/connectivity';

const now = () => new Date().toISOString();

const mapClient = (client: ClientResponse, organizationId: string): LocalTiersClient => ({
  idClient: client.idClient ?? crypto.randomUUID(),
  raisonSociale: client.raisonSociale,
  numeroTva: client.numeroTva,
  limiteCredit: client.limiteCredit,
  soldeCourant: client.soldeCourant,
  codeClient: client.codeClient,
  actif: client.actif,
  email: client.email,
  telephone: client.telephone,
  adresse: client.adresse,
  username: client.username,
  organizationId,
  syncStatus: 'synced',
  createdAt: client.createdAt ?? now(),
  updatedAt: client.updatedAt ?? now(),
});

const mapFournisseur = (f: FournisseurResponse, organizationId: string): LocalTiersFournisseur => ({
  idFournisseur: f.idFournisseur ?? crypto.randomUUID(),
  raisonSociale: f.raisonSociale,
  codeFournisseur: f.codeFournisseur,
  actif: f.actif,
  email: f.email,
  telephone: f.telephone,
  adresse: f.adresse,
  organizationId,
  syncStatus: 'synced',
  createdAt: f.createdAt ?? now(),
  updatedAt: f.updatedAt ?? now(),
});

const mapTaxe = (taxe: TaxeResponse, organizationId: string): LocalTaxe => ({
  id: taxe.idTaxe ?? crypto.randomUUID(),
  code: taxe.typeTaxe,
  taux: taxe.calculTaxe,
  description: taxe.nomTaxe,
  nomTaxe: taxe.nomTaxe,
  calculTaxe: taxe.calculTaxe,
  actif: taxe.actif,
  organizationId,
  syncStatus: 'synced',
  createdAt: taxe.createdAt ?? now(),
  updatedAt: taxe.updatedAt ?? now(),
});

export const syncReferenceData = async (): Promise<void> => {
  const seller = getStoredSeller();
  if (!seller?.organizationId) return;

  const online = await isFullyOnline();
  if (!online) return;

  const orgId = seller.organizationId;

  try {
    const [clients, fournisseurs, taxes] = await Promise.all([
      ClientsService.getAllClients(),
      FournisseursService.getAllFournisseurs(),
      TaxeService.getTaxesByOrganizationId(orgId),
    ]);

    await offlineDb.transaction('rw', offlineDb.tiers_clients, offlineDb.tiers_fournisseurs, offlineDb.taxes, async () => {
      const existingClients = await offlineDb.tiers_clients.where('organizationId').equals(orgId).toArray();
      const existingFournisseurs = await offlineDb.tiers_fournisseurs.where('organizationId').equals(orgId).toArray();
      const existingTaxes = await offlineDb.taxes.where('organizationId').equals(orgId).toArray();

      await Promise.all(existingClients.map((c) => offlineDb.tiers_clients.delete(c.idClient)));
      await Promise.all(existingFournisseurs.map((f) => offlineDb.tiers_fournisseurs.delete(f.idFournisseur)));
      await Promise.all(existingTaxes.map((t) => offlineDb.taxes.delete(t.id)));

      await offlineDb.tiers_clients.bulkAdd(clients.map((c) => mapClient(c, orgId)));
      await offlineDb.tiers_fournisseurs.bulkAdd(fournisseurs.map((f) => mapFournisseur(f, orgId)));
      await offlineDb.taxes.bulkAdd(taxes.map((t) => mapTaxe(t, orgId)));
    });
  } catch (err) {
    console.error('[ReferenceSync] Failed:', err);
  }
};

export const getLocalClients = async (organizationId: string): Promise<LocalTiersClient[]> => {
  return offlineDb.tiers_clients.where('organizationId').equals(organizationId).toArray();
};

export const getLocalFournisseurs = async (organizationId: string): Promise<LocalTiersFournisseur[]> => {
  return offlineDb.tiers_fournisseurs.where('organizationId').equals(organizationId).toArray();
};

export const getLocalTaxes = async (organizationId: string): Promise<LocalTaxe[]> => {
  return offlineDb.taxes.where('organizationId').equals(organizationId).toArray();
};
