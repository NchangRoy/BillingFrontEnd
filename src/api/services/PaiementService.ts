/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Pageable } from '../models/Pageable';
import type { PagePaiementResponse } from '../models/PagePaiementResponse';
import type { PaiementCreateRequest } from '../models/PaiementCreateRequest';
import type { PaiementResponse } from '../models/PaiementResponse';
import type { PaiementUpdateRequest } from '../models/PaiementUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaiementService {
    /**
     * Récupérer un paiement par ID
     * @param paiementId
     * @returns PaiementResponse OK
     * @throws ApiError
     */
    public static getPaiementById(
        paiementId: string,
    ): CancelablePromise<PaiementResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements/{paiementId}',
            path: {
                'paiementId': paiementId,
            },
        });
    }
    /**
     * Mettre à jour un paiement
     * @param paiementId
     * @param requestBody
     * @returns PaiementResponse OK
     * @throws ApiError
     */
    public static updatePaiement(
        paiementId: string,
        requestBody: PaiementUpdateRequest,
    ): CancelablePromise<PaiementResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/paiements/{paiementId}',
            path: {
                'paiementId': paiementId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer un paiement
     * @param paiementId
     * @returns any OK
     * @throws ApiError
     */
    public static deletePaiement(
        paiementId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/paiements/{paiementId}',
            path: {
                'paiementId': paiementId,
            },
        });
    }
    /**
     * Récupérer tous les paiements
     * @returns PaiementResponse OK
     * @throws ApiError
     */
    public static getAllPaiements(): CancelablePromise<Array<PaiementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements',
        });
    }
    /**
     * Créer un nouveau paiement
     * @param requestBody
     * @returns PaiementResponse OK
     * @throws ApiError
     */
    public static createPaiement(
        requestBody: PaiementCreateRequest,
    ): CancelablePromise<PaiementResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/paiements',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtenir le total des paiements par période
     * @param dateDebut
     * @param dateFin
     * @returns number OK
     * @throws ApiError
     */
    public static getTotalPaiementsByPeriode(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements/total/periode',
            query: {
                'dateDebut': dateDebut,
                'dateFin': dateFin,
            },
        });
    }
    /**
     * Obtenir le total des paiements d'une facture
     * @param factureId
     * @returns number OK
     * @throws ApiError
     */
    public static getTotalPaiementsByFacture(
        factureId: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements/total/facture/{factureId}',
            path: {
                'factureId': factureId,
            },
        });
    }
    /**
     * Obtenir le total des paiements d'un client
     * @param clientId
     * @returns number OK
     * @throws ApiError
     */
    public static getTotalPaiementsByClient(
        clientId: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements/total/client/{clientId}',
            path: {
                'clientId': clientId,
            },
        });
    }
    /**
     * Récupérer les paiements par période
     * @param dateDebut
     * @param dateFin
     * @returns PaiementResponse OK
     * @throws ApiError
     */
    public static getPaiementsByPeriode(
        dateDebut: string,
        dateFin: string,
    ): CancelablePromise<Array<PaiementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements/periode',
            query: {
                'dateDebut': dateDebut,
                'dateFin': dateFin,
            },
        });
    }
    /**
     * Récupérer tous les paiements avec pagination
     * @param pageable
     * @returns PagePaiementResponse OK
     * @throws ApiError
     */
    public static getAllPaiementsPaginated(
        pageable: Pageable,
    ): CancelablePromise<PagePaiementResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements/paginated',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * Récupérer les paiements par mode de paiement
     * @param modePaiement
     * @returns PaiementResponse OK
     * @throws ApiError
     */
    public static getPaiementsByModePaiement(
        modePaiement: 'ESPECES' | 'CHEQUE' | 'VIREMENT' | 'CARTE_BANCAIRE' | 'AUTRE',
    ): CancelablePromise<Array<PaiementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements/mode/{modePaiement}',
            path: {
                'modePaiement': modePaiement,
            },
        });
    }
    /**
     * Récupérer les paiements d'une facture
     * @param factureId
     * @returns PaiementResponse OK
     * @throws ApiError
     */
    public static getPaiementsByFacture(
        factureId: string,
    ): CancelablePromise<Array<PaiementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements/facture/{factureId}',
            path: {
                'factureId': factureId,
            },
        });
    }
    /**
     * Récupérer les paiements d'un client
     * @param clientId
     * @returns PaiementResponse OK
     * @throws ApiError
     */
    public static getPaiementsByClient(
        clientId: string,
    ): CancelablePromise<Array<PaiementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/paiements/client/{clientId}',
            path: {
                'clientId': clientId,
            },
        });
    }
}
