/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnalyticsService {
    /**
     * Rapport des ventes par période
     * @param startDate
     * @param endDate
     * @returns any OK
     * @throws ApiError
     */
    public static getRapportVentes(
        startDate: string,
        endDate: string,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/ventes/periode',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * Valeur totale du stock
     * @returns any OK
     * @throws ApiError
     */
    public static getValeurStock(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/stocks/valeur',
        });
    }
    /**
     * Stocks avec alertes (sous le minimum)
     * @returns any OK
     * @throws ApiError
     */
    public static getStocksAlertes(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/stocks/alertes',
        });
    }
    /**
     * Top produits vendus
     * @param limit
     * @returns any OK
     * @throws ApiError
     */
    public static getTopProduits(
        limit: number = 10,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/produits/top',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Top clients par chiffre d'affaires
     * @param limit
     * @returns any OK
     * @throws ApiError
     */
    public static getTopClients(
        limit: number = 10,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/analytics/clients/top',
            query: {
                'limit': limit,
            },
        });
    }
}
