/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PortalAccessToken = {
    id?: string;
    token?: string;
    resourceId?: string;
    resourceType?: PortalAccessToken.resourceType;
    clientEmail?: string;
    createdAt?: string;
    expiresAt?: string;
    used?: boolean;
};
export namespace PortalAccessToken {
    export enum resourceType {
        QUOTATION = 'QUOTATION',
        INVOICE = 'INVOICE',
        SALES_ORDER = 'SALES_ORDER',
        PROFORMA_INVOICE = 'PROFORMA_INVOICE',
        PURCHASE_ORDER = 'PURCHASE_ORDER',
    }
}
