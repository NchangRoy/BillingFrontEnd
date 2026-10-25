/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuotationProposalLineRequest } from './QuotationProposalLineRequest';
export type QuotationProposalCreateRequest = {
    idClient?: string;
    nomClient?: string;
    emailClient?: string;
    organizationId?: string;
    dateValidite?: string;
    commentary?: string;
    lignesProposal?: Array<QuotationProposalLineRequest>;
    applyVat?: boolean;
    devise?: string;
    montantHT?: number;
    montantTVA?: number;
    montantTTC?: number;
};

