/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BackOrderRequest } from '../models/BackOrderRequest';
import type { BackOrderResponse } from '../models/BackOrderResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BackOrderService {
    public static getAllBackOrders(): CancelablePromise<Array<BackOrderResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facturation/back-orders',
        });
    }
    public static createBackOrder(
        requestBody: BackOrderRequest,
    ): CancelablePromise<BackOrderResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facturation/back-orders',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    public static getBackOrderById(
        id: string,
    ): CancelablePromise<BackOrderResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facturation/back-orders/{id}',
            path: { 'id': id },
        });
    }
    public static updateBackOrder(
        id: string,
        requestBody: BackOrderRequest,
    ): CancelablePromise<BackOrderResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/facturation/back-orders/{id}',
            path: { 'id': id },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    public static deleteBackOrder(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/facturation/back-orders/{id}',
            path: { 'id': id },
        });
    }
    public static updateStatut(
        id: string,
        statut: 'EN_ATTENTE' | 'PARTIELLEMENT_LIVRE' | 'LIVRE' | 'ANNULE',
    ): CancelablePromise<BackOrderResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/facturation/back-orders/{id}/statut',
            path: { 'id': id },
            query: { 'statut': statut },
        });
    }
    public static getByOrganizationId(
        organizationId: string,
    ): CancelablePromise<Array<BackOrderResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facturation/back-orders/organisation/{organizationId}',
            path: { 'organizationId': organizationId },
        });
    }
    public static getByAgencyId(
        agencyId: string,
    ): CancelablePromise<Array<BackOrderResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facturation/back-orders/agence/{agencyId}',
            path: { 'agencyId': agencyId },
        });
    }
    public static getByIdBonAchat(
        idBonAchat: string,
    ): CancelablePromise<Array<BackOrderResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facturation/back-orders/bon-achat/{idBonAchat}',
            path: { 'idBonAchat': idBonAchat },
        });
    }
}
