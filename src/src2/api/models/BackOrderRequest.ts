/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LigneBackOrder } from './LigneBackOrder';
export type BackOrderRequest = {
    idBonAchat?: string;
    lignes?: Array<LigneBackOrder>;
    statut?: BackOrderRequest.statut;
    remarques?: string;
    organizationId?: string;
    agencyId?: string;
};
export namespace BackOrderRequest {
    export enum statut {
        EN_ATTENTE = 'EN_ATTENTE',
        PARTIELLEMENT_LIVRE = 'PARTIELLEMENT_LIVRE',
        LIVRE = 'LIVRE',
        ANNULE = 'ANNULE',
    }
}
