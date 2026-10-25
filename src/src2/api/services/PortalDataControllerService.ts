/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BonAchatResponse } from '../models/BonAchatResponse';
import type { ClientResponse } from '../models/ClientResponse';
import type { DevisResponse } from '../models/DevisResponse';
import type { FactureFournisseurResponse } from '../models/FactureFournisseurResponse';
import type { FactureResponse } from '../models/FactureResponse';
import type { QuotationProposalCreateRequest } from '../models/QuotationProposalCreateRequest';
import type { QuotationProposalResponse } from '../models/QuotationProposalResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PortalDataControllerService {
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static rejectQuotation(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/quotations/{id}/reject',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static acceptQuotation(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/quotations/{id}/accept',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns QuotationProposalResponse OK
     * @throws ApiError
     */
    public static getMyQuotationProposals(): CancelablePromise<Array<QuotationProposalResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/quotation-proposals',
        });
    }
    /**
     * @param requestBody
     * @returns QuotationProposalResponse OK
     * @throws ApiError
     */
    public static proposeQuotation(
        requestBody: QuotationProposalCreateRequest,
    ): CancelablePromise<QuotationProposalResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/quotation-proposals',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static rejectPurchaseOrder(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/purchase-orders/{id}/reject',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static acceptPurchaseOrder(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/purchase-orders/{id}/accept',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns FactureFournisseurResponse OK
     * @throws ApiError
     */
    public static getMySupplierInvoices(): CancelablePromise<Array<FactureFournisseurResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/supplier-invoices',
        });
    }
    /**
     * @returns DevisResponse OK
     * @throws ApiError
     */
    public static getMyQuotations(): CancelablePromise<Array<DevisResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/quotations',
        });
    }
    /**
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getMyPurchaseOrders(): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/purchase-orders',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getMyOrganizationBranding(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/organization',
        });
    }
    /**
     * @param organizationId
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getMyClientInfo(
        organizationId?: string,
    ): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/me/client',
            query: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * @returns FactureResponse OK
     * @throws ApiError
     */
    public static getMyInvoices(): CancelablePromise<Array<FactureResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/portal/invoices',
        });
    }
}
