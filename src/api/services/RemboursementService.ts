/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Pageable } from '../models/Pageable';
import type { PageRemboursementResponse } from '../models/PageRemboursementResponse';
import type { RemboursementCreateRequest } from '../models/RemboursementCreateRequest';
import type { RemboursementResponse } from '../models/RemboursementResponse';
import type { RemboursementUpdateRequest } from '../models/RemboursementUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RemboursementService {
    /**
     * Récupérer un remboursement par ID
     * @param remboursementId
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementById(
        remboursementId: string,
    ): CancelablePromise<RemboursementResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/{remboursementId}',
            path: {
                'remboursementId': remboursementId,
            },
        });
    }
    /**
     * Mettre à jour un remboursement
     * @param remboursementId
     * @param requestBody
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static updateRemboursement(
        remboursementId: string,
        requestBody: RemboursementUpdateRequest,
    ): CancelablePromise<RemboursementResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/remboursements/{remboursementId}',
            path: {
                'remboursementId': remboursementId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer un remboursement
     * @param remboursementId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteRemboursement(
        remboursementId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/remboursements/{remboursementId}',
            path: {
                'remboursementId': remboursementId,
            },
        });
    }
    /**
     * Mettre à jour le statut d'un remboursement
     * @param remboursementId
     * @param statut
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static updateStatut(
        remboursementId: string,
        statut: string,
    ): CancelablePromise<RemboursementResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/remboursements/{remboursementId}/statut',
            path: {
                'remboursementId': remboursementId,
            },
            query: {
                'statut': statut,
            },
        });
    }
    /**
     * Récupérer tous les remboursements
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getAllRemboursements(): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements',
        });
    }
    /**
     * Créer un nouveau remboursement
     * @param requestBody
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static createRemboursement(
        requestBody: RemboursementCreateRequest,
    ): CancelablePromise<RemboursementResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/remboursements',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Calculer le montant total des remboursements par statut
     * @param statut
     * @returns number OK
     * @throws ApiError
     */
    public static getTotalMontantByStatut(
        statut: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/total/statut/{statut}',
            path: {
                'statut': statut,
            },
        });
    }
    /**
     * Calculer le montant total des remboursements par client
     * @param idClient
     * @returns number OK
     * @throws ApiError
     */
    public static getTotalMontantByClient(
        idClient: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/total/client/{idClient}',
            path: {
                'idClient': idClient,
            },
        });
    }
    /**
     * Récupérer les remboursements par statut
     * @param statut
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementsByStatut(
        statut: string,
    ): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/statut/{statut}',
            path: {
                'statut': statut,
            },
        });
    }
    /**
     * Récupérer les remboursements en retard
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getOverdueRemboursements(): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/retard',
        });
    }
    /**
     * Récupérer tous les remboursements avec pagination
     * @param pageable
     * @returns PageRemboursementResponse OK
     * @throws ApiError
     */
    public static getAllRemboursementsPaginated(
        pageable: Pageable,
    ): CancelablePromise<PageRemboursementResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/page',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * Récupérer les remboursements par fourchette de montant
     * @param minAmount
     * @param maxAmount
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementsByMontantRange(
        minAmount: number,
        maxAmount: number,
    ): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/montant-range',
            query: {
                'minAmount': minAmount,
                'maxAmount': maxAmount,
            },
        });
    }
    /**
     * Récupérer les remboursements par facture
     * @param idFacture
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementsByFacture(
        idFacture: string,
    ): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/facture/{idFacture}',
            path: {
                'idFacture': idFacture,
            },
        });
    }
    /**
     * Récupérer les remboursements par devise
     * @param devise
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementsByDevise(
        devise: string,
    ): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/devise/{devise}',
            path: {
                'devise': devise,
            },
        });
    }
    /**
     * Récupérer les remboursements par période de facturation
     * @param startDate
     * @param endDate
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementsByDateFacturation(
        startDate: string,
        endDate: string,
    ): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/date-facturation',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * Récupérer les remboursements par période d'échéance
     * @param startDate
     * @param endDate
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementsByDateEcheance(
        startDate: string,
        endDate: string,
    ): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/date-echeance',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * Récupérer les remboursements par période comptable
     * @param startDate
     * @param endDate
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementsByDateComptable(
        startDate: string,
        endDate: string,
    ): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/date-comptable',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * Compter les remboursements par statut
     * @param statut
     * @returns number OK
     * @throws ApiError
     */
    public static countByStatut(
        statut: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/count/statut/{statut}',
            path: {
                'statut': statut,
            },
        });
    }
    /**
     * Compter les remboursements par client
     * @param idClient
     * @returns number OK
     * @throws ApiError
     */
    public static countByClient(
        idClient: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/count/client/{idClient}',
            path: {
                'idClient': idClient,
            },
        });
    }
    /**
     * Récupérer les remboursements par client
     * @param idClient
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementsByClient(
        idClient: string,
    ): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/client/{idClient}',
            path: {
                'idClient': idClient,
            },
        });
    }
    /**
     * Récupérer les remboursements par client et statut
     * @param idClient
     * @param statut
     * @returns RemboursementResponse OK
     * @throws ApiError
     */
    public static getRemboursementsByClientAndStatut(
        idClient: string,
        statut: string,
    ): CancelablePromise<Array<RemboursementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/remboursements/client/{idClient}/statut/{statut}',
            path: {
                'idClient': idClient,
                'statut': statut,
            },
        });
    }
}
