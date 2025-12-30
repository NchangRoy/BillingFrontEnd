/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BanqueCreateRequest } from '../models/BanqueCreateRequest';
import type { BanqueResponse } from '../models/BanqueResponse';
import type { BanqueUpdateRequest } from '../models/BanqueUpdateRequest';
import type { Pageable } from '../models/Pageable';
import type { PageBanqueResponse } from '../models/PageBanqueResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BanqueService {
    /**
     * Récupérer une banque par ID
     * @param banqueId
     * @returns BanqueResponse OK
     * @throws ApiError
     */
    public static getBanqueById(
        banqueId: string,
    ): CancelablePromise<BanqueResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banques/{banqueId}',
            path: {
                'banqueId': banqueId,
            },
        });
    }
    /**
     * Mettre à jour une banque
     * @param banqueId
     * @param requestBody
     * @returns BanqueResponse OK
     * @throws ApiError
     */
    public static updateBanque(
        banqueId: string,
        requestBody: BanqueUpdateRequest,
    ): CancelablePromise<BanqueResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/banques/{banqueId}',
            path: {
                'banqueId': banqueId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer une banque
     * @param banqueId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteBanque(
        banqueId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/banques/{banqueId}',
            path: {
                'banqueId': banqueId,
            },
        });
    }
    /**
     * Récupérer toutes les banques
     * @returns BanqueResponse OK
     * @throws ApiError
     */
    public static getAllBanques(): CancelablePromise<Array<BanqueResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banques',
        });
    }
    /**
     * Créer une nouvelle banque
     * @param requestBody
     * @returns BanqueResponse OK
     * @throws ApiError
     */
    public static createBanque(
        requestBody: BanqueCreateRequest,
    ): CancelablePromise<BanqueResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/banques',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Rechercher des banques par numéro de compte
     * @param numeroCompte
     * @returns BanqueResponse OK
     * @throws ApiError
     */
    public static searchBanquesByNumeroCompte(
        numeroCompte: string,
    ): CancelablePromise<Array<BanqueResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banques/search/numero-compte',
            query: {
                'numeroCompte': numeroCompte,
            },
        });
    }
    /**
     * Rechercher des banques par nom
     * @param nom
     * @returns BanqueResponse OK
     * @throws ApiError
     */
    public static searchBanquesByName(
        nom: string,
    ): CancelablePromise<Array<BanqueResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banques/search/nom',
            query: {
                'nom': nom,
            },
        });
    }
    /**
     * Récupérer toutes les banques avec pagination
     * @param pageable
     * @returns PageBanqueResponse OK
     * @throws ApiError
     */
    public static getAllBanquesPaginated(
        pageable: Pageable,
    ): CancelablePromise<PageBanqueResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banques/page',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * Récupérer une banque par numéro de compte
     * @param numeroCompte
     * @returns BanqueResponse OK
     * @throws ApiError
     */
    public static getBanqueByNumeroCompte(
        numeroCompte: string,
    ): CancelablePromise<BanqueResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banques/numero-compte/{numeroCompte}',
            path: {
                'numeroCompte': numeroCompte,
            },
        });
    }
    /**
     * Récupérer les banques par nom
     * @param nomBanque
     * @returns BanqueResponse OK
     * @throws ApiError
     */
    public static getBanquesByName(
        nomBanque: string,
    ): CancelablePromise<Array<BanqueResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/banques/nom/{nomBanque}',
            path: {
                'nomBanque': nomBanque,
            },
        });
    }
}
