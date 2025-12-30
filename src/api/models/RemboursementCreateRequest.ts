/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RemboursementCreateRequest = {
    dateFacturation: string;
    dateComptable: string;
    referencePaiement?: string;
    banqueDestination?: string;
    dateEcheance: string;
    montant: number;
    devise?: string;
    tauxChange?: number;
    motif?: string;
    numeroPiece?: string;
    idFacture?: string;
    idClient?: string;
};

