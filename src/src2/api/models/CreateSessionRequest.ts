/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateSessionRequest = {
    type: CreateSessionRequest.type;
    salesPointId?: string;
    organizationId?: string;
    agencyId?: string;
    sellerId: string;
    openingAmount: number;
    startTime?: string;
    endTime?: string;
};
export namespace CreateSessionRequest {
    export enum type {
        POS = 'POS',
        SALES = 'SALES',
    }
}

