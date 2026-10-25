/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaymentOrderInitiateRequest } from '../models/PaymentOrderInitiateRequest';
import type { PaymentOrderResponse } from '../models/PaymentOrderResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentGatewayService {
    /**
     * Initier un paiement (carte ou mobile money)
     * @param requestBody
     * @returns PaymentOrderResponse OK
     * @throws ApiError
     */
    public static initiateOrder(
        requestBody: PaymentOrderInitiateRequest,
    ): CancelablePromise<PaymentOrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payments/orders',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Récupérer le statut d'un paiement — utilisé par le POS pour le polling
     * @param id
     * @returns PaymentOrderResponse OK
     * @throws ApiError
     */
    public static getOrder(
        id: string,
    ): CancelablePromise<PaymentOrderResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/payments/orders/{id}',
            path: {
                'id': id,
            },
        });
    }
}
