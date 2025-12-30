/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LigneFactureCreateRequest } from './LigneFactureCreateRequest';
export type FactureUpdateRequest = {
    dateFacturation?: string;
    dateEcheance?: string;
    type?: string;
    etat?: FactureUpdateRequest.etat;
    idClient?: string;
    lignesFacture?: Array<LigneFactureCreateRequest>;
    devise?: string;
    tauxChange?: number;
    conditionsPaiement?: string;
    notes?: string;
    referenceCommande?: string;
};
export namespace FactureUpdateRequest {
    export enum etat {
        BROUILLON = 'BROUILLON',
        ENVOYE = 'ENVOYE',
        PAYE = 'PAYE',
        PARTIELLEMENT_PAYE = 'PARTIELLEMENT_PAYE',
        EN_RETARD = 'EN_RETARD',
        ANNULE = 'ANNULE',
    }
}

