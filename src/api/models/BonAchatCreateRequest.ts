/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BonAchatCreateRequest = {
    numeroBon: string;
    dateAchat: string;
    dateLivraison?: string;
    idFournisseur: string;
    nomFournisseur?: string;
    idBonCommande?: string;
    numeroCommandeRef?: string;
    montantTotal: number;
    montantHT?: number;
    montantTVA?: number;
    devise?: string;
    tauxChange?: number;
    numeroFactureFournisseur?: string;
    modePaiement?: string;
    conditionsPaiement?: string;
    notes?: string;
    createdBy?: string;
};


