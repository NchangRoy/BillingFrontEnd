/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PortalAccessToken } from '../models/PortalAccessToken';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PortalTokenControllerService {
    public static getAll(): CancelablePromise<Array<PortalAccessToken>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/portal-tokens',
        });
    }
    public static generateToken(
        resourceId: string,
        resourceType: 'QUOTATION' | 'INVOICE' | 'SALES_ORDER' | 'PROFORMA_INVOICE' | 'PURCHASE_ORDER',
        clientEmail: string,
    ): CancelablePromise<PortalAccessToken> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/portal-tokens/generate',
            query: {
                'resourceId': resourceId,
                'resourceType': resourceType,
                'clientEmail': clientEmail,
            },
        });
    }
    public static validateAndGet(
        token: string,
    ): CancelablePromise<PortalAccessToken> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/portal-tokens/validate/{token}',
            path: { 'token': token },
        });
    }
}
