/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FournisseurResponse } from '../models/FournisseurResponse';
import type { InviteClientRequest } from '../models/InviteClientRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FournisseursService {
    /**
     * (Ré)envoyer les identifiants du portail fournisseur
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static inviteFournisseur(
        id: string,
        requestBody: InviteClientRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tiers/fournisseurs/{id}/invite',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lister tous les fournisseurs actifs
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static getAllFournisseurs(): CancelablePromise<Array<FournisseurResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tiers/fournisseurs',
        });
    }
    /**
     * Récupérer un fournisseur par ID
     * @param id
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static getFournisseurById(
        id: string,
    ): CancelablePromise<FournisseurResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tiers/fournisseurs/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Nombre de fournisseurs actifs
     * @returns number OK
     * @throws ApiError
     */
    public static countFournisseurs(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tiers/fournisseurs/count',
        });
    }
}
