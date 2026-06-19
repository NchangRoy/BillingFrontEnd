/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LigneBackOrder } from './LigneBackOrder';
export type BackOrderResponse = {
    id?: string;
    idBonAchat?: string;
    statut?: BackOrderResponse.statut;
    lignes?: Array<LigneBackOrder>;
    remarques?: string;
    createdAt?: string;
    updatedAt?: string;
    organizationId?: string;
    agencyId?: string;
};
export namespace BackOrderResponse {
    export enum statut {
        EN_ATTENTE = 'EN_ATTENTE',
        PARTIELLEMENT_LIVRE = 'PARTIELLEMENT_LIVRE',
        LIVRE = 'LIVRE',
        ANNULE = 'ANNULE',
    }
}
