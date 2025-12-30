/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BonCommandeCreateRequest } from '../models/BonCommandeCreateRequest';
import type { BonCommandeResponse } from '../models/BonCommandeResponse';
import type { BonCommandeUpdateRequest } from '../models/BonCommandeUpdateRequest';
import type { Pageable } from '../models/Pageable';
import type { PageBonCommandeResponse } from '../models/PageBonCommandeResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BonDeCommandeService {
    /**
     * Récupérer un bon de commande par ID
     * @param bonCommandeId
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getBonCommandeById(
        bonCommandeId: string,
    ): CancelablePromise<BonCommandeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/{bonCommandeId}',
            path: {
                'bonCommandeId': bonCommandeId,
            },
        });
    }
    /**
     * Mettre à jour un bon de commande
     * @param bonCommandeId
     * @param requestBody
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static updateBonCommande(
        bonCommandeId: string,
        requestBody: BonCommandeUpdateRequest,
    ): CancelablePromise<BonCommandeResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/bons-commande/{bonCommandeId}',
            path: {
                'bonCommandeId': bonCommandeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer un bon de commande
     * @param bonCommandeId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteBonCommande(
        bonCommandeId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/bons-commande/{bonCommandeId}',
            path: {
                'bonCommandeId': bonCommandeId,
            },
        });
    }
    /**
     * Valider un bon de commande
     * @param bonCommandeId
     * @param validatedBy
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static validerBonCommande(
        bonCommandeId: string,
        validatedBy: string,
    ): CancelablePromise<BonCommandeResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/bons-commande/{bonCommandeId}/valider',
            path: {
                'bonCommandeId': bonCommandeId,
            },
            query: {
                'validatedBy': validatedBy,
            },
        });
    }
    /**
     * Mettre à jour le statut d'un bon de commande
     * @param bonCommandeId
     * @param statut
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static updateStatut1(
        bonCommandeId: string,
        statut: string,
    ): CancelablePromise<BonCommandeResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/bons-commande/{bonCommandeId}/statut',
            path: {
                'bonCommandeId': bonCommandeId,
            },
            query: {
                'statut': statut,
            },
        });
    }
    /**
     * Récupérer tous les bons de commande
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getAllBonCommandes(): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande',
        });
    }
    /**
     * Créer un nouveau bon de commande
     * @param requestBody
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static createBonCommande(
        requestBody: BonCommandeCreateRequest,
    ): CancelablePromise<BonCommandeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bons-commande',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Calculer le montant total des commandes par statut
     * @param statut
     * @returns number OK
     * @throws ApiError
     */
    public static getTotalMontantByStatut1(
        statut: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/total/statut/{statut}',
            path: {
                'statut': statut,
            },
        });
    }
    /**
     * Calculer le montant total des commandes par fournisseur
     * @param idFournisseur
     * @returns number OK
     * @throws ApiError
     */
    public static getTotalMontantByFournisseur(
        idFournisseur: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/total/fournisseur/{idFournisseur}',
            path: {
                'idFournisseur': idFournisseur,
            },
        });
    }
    /**
     * Récupérer les bons de commande par statut
     * @param statut
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getBonCommandesByStatut(
        statut: string,
    ): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/statut/{statut}',
            path: {
                'statut': statut,
            },
        });
    }
    /**
     * Rechercher des bons de commande par numéro
     * @param numero
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static searchBonCommandesByNumero(
        numero: string,
    ): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/search/numero',
            query: {
                'numero': numero,
            },
        });
    }
    /**
     * Rechercher des bons de commande par fournisseur
     * @param fournisseur
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static searchBonCommandesByFournisseur(
        fournisseur: string,
    ): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/search/fournisseur',
            query: {
                'fournisseur': fournisseur,
            },
        });
    }
    /**
     * Récupérer tous les bons de commande avec pagination
     * @param pageable
     * @returns PageBonCommandeResponse OK
     * @throws ApiError
     */
    public static getAllBonCommandesPaginated(
        pageable: Pageable,
    ): CancelablePromise<PageBonCommandeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/page',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * Récupérer un bon de commande par numéro
     * @param numeroCommande
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getBonCommandeByNumero(
        numeroCommande: string,
    ): CancelablePromise<BonCommandeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/numero/{numeroCommande}',
            path: {
                'numeroCommande': numeroCommande,
            },
        });
    }
    /**
     * Récupérer les bons de commande par fourchette de montant
     * @param minAmount
     * @param maxAmount
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getBonCommandesByMontantRange(
        minAmount: number,
        maxAmount: number,
    ): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/montant-range',
            query: {
                'minAmount': minAmount,
                'maxAmount': maxAmount,
            },
        });
    }
    /**
     * Récupérer les bons de commande par fournisseur
     * @param idFournisseur
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getBonCommandesByFournisseur(
        idFournisseur: string,
    ): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/fournisseur/{idFournisseur}',
            path: {
                'idFournisseur': idFournisseur,
            },
        });
    }
    /**
     * Récupérer les bons de commande par fournisseur et statut
     * @param idFournisseur
     * @param statut
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getBonCommandesByFournisseurAndStatut(
        idFournisseur: string,
        statut: string,
    ): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/fournisseur/{idFournisseur}/statut/{statut}',
            path: {
                'idFournisseur': idFournisseur,
                'statut': statut,
            },
        });
    }
    /**
     * Récupérer les bons de commande par devise
     * @param devise
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getBonCommandesByDevise(
        devise: string,
    ): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/devise/{devise}',
            path: {
                'devise': devise,
            },
        });
    }
    /**
     * Récupérer les bons de commande par période de livraison
     * @param startDate
     * @param endDate
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getBonCommandesByDateLivraison(
        startDate: string,
        endDate: string,
    ): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/date-livraison',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * Récupérer les bons de commande par période
     * @param startDate
     * @param endDate
     * @returns BonCommandeResponse OK
     * @throws ApiError
     */
    public static getBonCommandesByDateCommande(
        startDate: string,
        endDate: string,
    ): CancelablePromise<Array<BonCommandeResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/date-commande',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * Compter les bons de commande par statut
     * @param statut
     * @returns number OK
     * @throws ApiError
     */
    public static countByStatut1(
        statut: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/count/statut/{statut}',
            path: {
                'statut': statut,
            },
        });
    }
    /**
     * Compter les bons de commande par fournisseur
     * @param idFournisseur
     * @returns number OK
     * @throws ApiError
     */
    public static countByFournisseur(
        idFournisseur: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-commande/count/fournisseur/{idFournisseur}',
            path: {
                'idFournisseur': idFournisseur,
            },
        });
    }
}
