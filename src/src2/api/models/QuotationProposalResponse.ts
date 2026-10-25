/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LigneQuotationProposal } from './LigneQuotationProposal';
export type QuotationProposalResponse = {
    idProposal?: string;
    numeroProposal?: string;
    organizationId?: string;
    idClient?: string;
    nomClient?: string;
    emailClient?: string;
    dateCreation?: string;
    dateValidite?: string;
    statut?: QuotationProposalResponse.statut;
    commentary?: string;
    lignesProposal?: Array<LigneQuotationProposal>;
    montantHT?: number;
    montantTVA?: number;
    montantTTC?: number;
    applyVat?: boolean;
    devise?: string;
    createdAt?: string;
    updatedAt?: string;
};
export namespace QuotationProposalResponse {
    export enum statut {
        BROUILLON = 'BROUILLON',
        ACCEPTED = 'ACCEPTED',
        REJECTED = 'REJECTED',
    }
}

