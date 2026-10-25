/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuotationProposalDecisionRequest } from '../models/QuotationProposalDecisionRequest';
import type { QuotationProposalResponse } from '../models/QuotationProposalResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuotationProposalsService {
    /**
     * Refuser une proposition de devis
     * @param id
     * @param requestBody
     * @returns QuotationProposalResponse OK
     * @throws ApiError
     */
    public static reject(
        id: string,
        requestBody?: QuotationProposalDecisionRequest,
    ): CancelablePromise<QuotationProposalResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/quotation-proposals/{id}/reject',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Accepter une proposition de devis
     * @param id
     * @param requestBody
     * @returns QuotationProposalResponse OK
     * @throws ApiError
     */
    public static accept(
        id: string,
        requestBody?: QuotationProposalDecisionRequest,
    ): CancelablePromise<QuotationProposalResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/quotation-proposals/{id}/accept',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lister toutes les propositions de devis
     * @returns QuotationProposalResponse OK
     * @throws ApiError
     */
    public static getAll5(): CancelablePromise<Array<QuotationProposalResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/quotation-proposals',
        });
    }
    /**
     * Récupérer une proposition par ID
     * @param id
     * @returns QuotationProposalResponse OK
     * @throws ApiError
     */
    public static getById3(
        id: string,
    ): CancelablePromise<QuotationProposalResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/quotation-proposals/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Récupérer les propositions par organisation
     * @param organizationId
     * @returns QuotationProposalResponse OK
     * @throws ApiError
     */
    public static getByOrganizationId3(
        organizationId: string,
    ): CancelablePromise<Array<QuotationProposalResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/quotation-proposals/organisation/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
        });
    }
}
