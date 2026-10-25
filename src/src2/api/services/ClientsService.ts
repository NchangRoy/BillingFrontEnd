/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientResponse } from '../models/ClientResponse';
import type { InviteClientRequest } from '../models/InviteClientRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClientsService {
    /**
     * (Ré)envoyer les identifiants du portail client
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static inviteClient(
        id: string,
        requestBody: InviteClientRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tiers/clients/{id}/invite',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Lister tous les clients actifs
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getAllClients(): CancelablePromise<Array<ClientResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tiers/clients',
        });
    }
    /**
     * Récupérer un client par ID
     * @param id
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getClientById(
        id: string,
    ): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tiers/clients/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Nombre de clients actifs
     * @returns number OK
     * @throws ApiError
     */
    public static countClients(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tiers/clients/count',
        });
    }
}
