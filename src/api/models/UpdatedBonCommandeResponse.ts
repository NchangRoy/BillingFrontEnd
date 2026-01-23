import type { LigneBonCommandeResponse } from './LigneBonCommandeResponse';

export type BonCommandeResponse = {
    idBonCommande?: string;
    numeroCommande?: string;

    // Dates
    dateCommande?: string;
    dateLivraisonPrevue?: string;
    dateSysteme?: string;

    // Supplier
    idFournisseur?: string;
    nomFournisseur?: string;
    adresseFournisseur?: string;
    emailFournisseur?: string;
    telephoneFournisseur?: string;

    // References
    referenceExterne?: string;
    nosRef?: string;
    vosRef?: string;

    // Lines (MANDATORY)
    lignesBonCommande?: Array<LigneBonCommandeResponse>;

    // Totals
    montantHT?: number;
    montantTVA?: number;
    montantTTC?: number;
    montantTotal?: number;
    finalAmount?: number;

    // VAT & currency
    applyVat?: boolean;
    devise?: string;
    tauxChange?: number;

    // Payment
    modeReglement?: BonCommandeResponse.modeReglement;
    conditionsPaiement?: string;
    nbreEcheance?: number;

    // Logistics
    delaiLivraison?: number;
    adresseLivraison?: string;

    // Status / workflow
    statut?: BonCommandeResponse.statut;
    validatedAt?: string;
    validatedBy?: string;

    // Notes & meta
    notes?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
};
