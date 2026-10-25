/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaymentOrderInitiateRequest = {
    amount: number;
    currency: string;
    provider: PaymentOrderInitiateRequest.provider;
    method: PaymentOrderInitiateRequest.method;
    payerReference?: string;
    description?: string;
};
export namespace PaymentOrderInitiateRequest {
    export enum provider {
        MYCOOLPAY = 'MYCOOLPAY',
        STRIPE = 'STRIPE',
    }
    export enum method {
        MOBILE_MONEY = 'MOBILE_MONEY',
        CARD = 'CARD',
    }
}

