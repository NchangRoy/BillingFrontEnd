/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LigneDevisCreateRequest } from './LigneDevisCreateRequest';
export type DevisCreateRequest = {
    dateCreation: string;
    dateValidite: string;
    type?: string;
    statut?: DevisCreateRequest.statut;
    idClient: string;
    lignesDevis?: Array<LigneDevisCreateRequest>;
    devise?: string;
    tauxChange?: number;
    conditionsPaiement?: string;
    notes?: string;
    referenceExterne?: string;
    remiseGlobalePourcentage?: number;
    remiseGlobaleMontant?: number;
    validiteOffreJours?: number;
};
export namespace DevisCreateRequest {
    export enum statut {
        BROUILLON = 'BROUILLON',
        ENVOYE = 'ENVOYE',
        ACCEPTE = 'ACCEPTE',
        REFUSE = 'REFUSE',
        EXPIRE = 'EXPIRE',
        ANNULE = 'ANNULE',
        CONVERTI_EN_FACTURE = 'CONVERTI_EN_FACTURE',
    }
}

