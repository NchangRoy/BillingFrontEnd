/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClientCreateRequest } from '../models/ClientCreateRequest';
import type { ClientResponse } from '../models/ClientResponse';
import type { ClientUpdateRequest } from '../models/ClientUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClientService {
    /**
     * Récupérer un client par ID
     * @param clientId
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getClientById(
        clientId: string,
    ): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clients/{clientId}',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Mettre à jour un client
     * @param clientId
     * @param requestBody
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static updateClient(
        clientId: string,
        requestBody: ClientUpdateRequest,
    ): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/clients/{clientId}',
            path: {
                'clientId': clientId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer un client
     * @param clientId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteClient(
        clientId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/clients/{clientId}',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Mettre à jour le solde d'un client
     * @param clientId
     * @param montant
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static updateSolde1(
        clientId: string,
        montant: number,
    ): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/clients/{clientId}/solde',
            path: {
                'clientId': clientId,
            },
            query: {
                'montant': montant,
            },
        });
    }
    /**
     * Récupérer tous les clients
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getAllClients(): CancelablePromise<Array<ClientResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clients',
        });
    }
    /**
     * Créer un nouveau client
     * @param requestBody
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static createClient(
        requestBody: ClientCreateRequest,
    ): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/clients',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Récupérer un client par username
     * @param username
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getClientByUsername(
        username: string,
    ): CancelablePromise<ClientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clients/username/{username}',
            path: {
                'username': username,
            },
        });
    }
    /**
     * Récupérer les clients par type
     * @param typeClient
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getClientsByType(
        typeClient: 'PARTICULIER' | 'ENTREPRISE' | 'ADMINISTRATION',
    ): CancelablePromise<Array<ClientResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clients/type/{typeClient}',
            path: {
                'typeClient': typeClient,
            },
        });
    }
    /**
     * Compter les clients actifs
     * @returns number OK
     * @throws ApiError
     */
    public static countActiveClients(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clients/count/actifs',
        });
    }
    /**
     * Récupérer tous les clients actifs
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getActiveClients(): CancelablePromise<Array<ClientResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/clients/actifs',
        });
    }
}
