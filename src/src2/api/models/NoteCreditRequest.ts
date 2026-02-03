/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LigneNoteCredit } from './LigneNoteCredit';
export type NoteCreditRequest = {
    numeroNoteCredit?: string;
    numeroFacture?: string;
    dateFacturation?: string;
    dateEcheance?: string;
    dateSysteme?: string;
    etat?: NoteCreditRequest.etat;
    type?: string;
    idClient?: string;
    nomClient?: string;
    adresseClient?: string;
    emailClient?: string;
    telephoneClient?: string;
    montantHT?: number;
    montantTVA?: number;
    montantTTC?: number;
    montantTotal?: number;
    montantRestant?: number;
    finalAmount?: number;
    remiseGlobalePourcentage?: number;
    remiseGlobaleMontant?: number;
    applyVat?: boolean;
    devise?: string;
    tauxChange?: number;
    modeReglement?: NoteCreditRequest.modeReglement;
    conditionsPaiement?: string;
    nbreEcheance?: number;
    nosRef?: string;
    vosRef?: string;
    referenceCommande?: string;
    idDevisOrigine?: string;
    lignesFacture?: Array<LigneNoteCredit>;
    notes?: string;
    pdfPath?: string;
    envoyeParEmail?: boolean;
    referalClientId?: string;
};
export namespace NoteCreditRequest {
    export enum etat {
         BROUILLON = 'BROUILLON',
        APPLIQUÉ = 'APPLIQUÉ', // Deducted from client's balance
        REMBOURSÉ = 'REMBOURSÉ', // Money sent back to client
        ANNULÉ = 'ANNULÉ',
    }
    export enum modeReglement {
        VIREMENT = 'VIREMENT',
        CARTE_ABANCAIRE = 'CARTE_BANCAIRE',
        ESPECES = 'ESPECES',
        CHEQUE = 'CHEQUE',
        PRELEVEMENT = 'PRELEVEMENT',
        PAYPAL = 'PAYPAL',
        AUTRE = 'AUTRE',
        BON_D_ACHAT = 'BON_D_ACHAT',
    }
}

