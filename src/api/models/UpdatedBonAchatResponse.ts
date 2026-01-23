import type { LigneBonAchatResponse } from './LigneBonAchatResponse';

export type UpdatedBonAchatResponse = {
    idBonAchat?: string;
    numeroBon?: string;

    dateAchat?: string;
    dateLivraisonPrevue?: string;
    dateSysteme?: string;

    // Supplier
    idFournisseur?: string;
    nomFournisseur?: string;
    adresseFournisseur?: string;
    emailFournisseur?: string;
    telephoneFournisseur?: string;

    // References
    idBonCommande?: string;
    numeroCommandeRef?: string;
    numeroFactureFournisseur?: string;

    // Lines (IMPORTANT)
    lignesBonAchat?: Array<LigneBonAchatResponse>;

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
    modePaiement?: BonAchatResponse.modePaiement;
    conditionsPaiement?: string;
    nbreEcheance?: number;

    // Workflow
    statut?: BonAchatResponse.statut;
    validatedAt?: string;
    validatedBy?: string;

    // Meta
    notes?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
};
