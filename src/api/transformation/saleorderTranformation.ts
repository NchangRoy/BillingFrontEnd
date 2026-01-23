
import { UpdatedDevisResponse } from "../models/UpdatedDevisResponse";
import { UpdatedSalesOrderResponse } from "../models/UpdatedSalesOrder";
import { SalesOrderResponse } from "../models/UpdatedSalesOrder";
export const transformDevisToSalesOrder = (devis: UpdatedDevisResponse): UpdatedSalesOrderResponse => {
    const now = new Date().toISOString();

    return {
        // We generate a temporary ID or leave it for the backend, 
        // but we definitely link the source quotation.
        numeroSalesOrder: `ORD-${now.slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`,
        
        // Dates
        dateCreation: now.split('T')[0],
        dateSysteme: now,
        // Default delivery is usually set to +3 days from now
        expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],

        // Status: Starts as Draft or Validated depending on your workflow
        statut: SalesOrderResponse.statut.BROUILLON,

        // Client Info (Copied directly)
        idClient: devis.idClient,
        nomClient: devis.nomClient,
        adresseClient: devis.adresseClient,
        emailClient: devis.emailClient,
        telephoneClient: devis.telephoneClient,

        // Recipient Info: Default to Client info, can be edited later in the UI
        recipientName: devis.nomClient,
        recipientPhone: devis.telephoneClient,
        recipientAddress: devis.adresseClient,

        // Reference to source Quotation (Crucial for tracking)
        idDevisOrigine: devis.idDevis,
        numeroDevisOrigine: devis.numeroDevis,

        // Line Items: Map Devis lines to Sales Order lines
        lignesSalesOrder: devis.lignesDevis || [],

        // Financial Summary
        montantHT: devis.montantHT,
        montantTVA: devis.montantTVA,
        montantTTC: devis.montantTTC,
        devise: devis.devise || 'XAF',

        // Logistics Defaults
        transportMethod: SalesOrderResponse.transportMethod.RETRAIT_MAGASIN,
        
        // Payment Info (Cast to SalesOrder version of enum)
        modeReglement: devis.modeReglement as unknown as SalesOrderResponse.modeReglement,

        // Additional Fields
        applyVat: devis.applyVat,
        nosRef: devis.numeroDevis, // Use the Devis number as internal ref
        vosRef: devis.vosRef,
        notes: devis.notes,

        // Metadata
        createdAt: now,
        updatedAt: now
    };
};