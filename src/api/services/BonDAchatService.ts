/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BonAchatCreateRequest } from '../models/BonAchatCreateRequest';
import type { BonAchatResponse } from '../models/BonAchatResponse';
import type { BonAchatUpdateRequest } from '../models/BonAchatUpdateRequest';
import type { Pageable } from '../models/Pageable';
import type { PageBonAchatResponse } from '../models/PageBonAchatResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BonDAchatService {
    /**
     * Récupérer un bon d'achat par ID
     * @param bonAchatId
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatById(
        bonAchatId: string,
    ): CancelablePromise<BonAchatResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/{bonAchatId}',
            path: {
                'bonAchatId': bonAchatId,
            },
        });
    }
    /**
     * Mettre à jour un bon d'achat
     * @param bonAchatId
     * @param requestBody
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static updateBonAchat(
        bonAchatId: string,
        requestBody: BonAchatUpdateRequest,
    ): CancelablePromise<BonAchatResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/bons-achat/{bonAchatId}',
            path: {
                'bonAchatId': bonAchatId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer un bon d'achat
     * @param bonAchatId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteBonAchat(
        bonAchatId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/bons-achat/{bonAchatId}',
            path: {
                'bonAchatId': bonAchatId,
            },
        });
    }
    /**
     * Valider un bon d'achat
     * @param bonAchatId
     * @param validatedBy
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static validerBonAchat(
        bonAchatId: string,
        validatedBy: string,
    ): CancelablePromise<BonAchatResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/bons-achat/{bonAchatId}/valider',
            path: {
                'bonAchatId': bonAchatId,
            },
            query: {
                'validatedBy': validatedBy,
            },
        });
    }
    /**
     * Mettre à jour le statut d'un bon d'achat
     * @param bonAchatId
     * @param statut
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static updateStatut2(
        bonAchatId: string,
        statut: string,
    ): CancelablePromise<BonAchatResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/bons-achat/{bonAchatId}/statut',
            path: {
                'bonAchatId': bonAchatId,
            },
            query: {
                'statut': statut,
            },
        });
    }
    /**
     * Récupérer tous les bons d'achat
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getAllBonAchats(): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat',
        });
    }
    /**
     * Créer un nouveau bon d'achat
     * @param requestBody
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static createBonAchat(
        requestBody: BonAchatCreateRequest,
    ): CancelablePromise<BonAchatResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/bons-achat',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Calculer le montant total des achats par statut
     * @param statut
     * @returns number OK
     * @throws ApiError
     */
    public static getTotalMontantByStatut2(
        statut: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/total/statut/{statut}',
            path: {
                'statut': statut,
            },
        });
    }
    /**
     * Calculer le montant total des achats par fournisseur
     * @param idFournisseur
     * @returns number OK
     * @throws ApiError
     */
    public static getTotalMontantByFournisseur1(
        idFournisseur: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/total/fournisseur/{idFournisseur}',
            path: {
                'idFournisseur': idFournisseur,
            },
        });
    }
    /**
     * Récupérer les bons d'achat par statut
     * @param statut
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatsByStatut(
        statut: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/statut/{statut}',
            path: {
                'statut': statut,
            },
        });
    }
    /**
     * Rechercher des bons d'achat par numéro
     * @param numero
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static searchBonAchatsByNumero(
        numero: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/search/numero',
            query: {
                'numero': numero,
            },
        });
    }
    /**
     * Rechercher des bons d'achat par fournisseur
     * @param fournisseur
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static searchBonAchatsByFournisseur(
        fournisseur: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/search/fournisseur',
            query: {
                'fournisseur': fournisseur,
            },
        });
    }
    /**
     * Rechercher des bons d'achat par facture fournisseur
     * @param numeroFacture
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static searchBonAchatsByFactureFournisseur(
        numeroFacture: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/search/facture-fournisseur',
            query: {
                'numeroFacture': numeroFacture,
            },
        });
    }
    /**
     * Récupérer tous les bons d'achat avec pagination
     * @param pageable
     * @returns PageBonAchatResponse OK
     * @throws ApiError
     */
    public static getAllBonAchatsPaginated(
        pageable: Pageable,
    ): CancelablePromise<PageBonAchatResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/page',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * Récupérer un bon d'achat par numéro
     * @param numeroBon
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatByNumero(
        numeroBon: string,
    ): CancelablePromise<BonAchatResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/numero/{numeroBon}',
            path: {
                'numeroBon': numeroBon,
            },
        });
    }
    /**
     * Récupérer les bons d'achat par fourchette de montant
     * @param minAmount
     * @param maxAmount
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatsByMontantRange(
        minAmount: number,
        maxAmount: number,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/montant-range',
            query: {
                'minAmount': minAmount,
                'maxAmount': maxAmount,
            },
        });
    }
    /**
     * Récupérer les bons d'achat par fournisseur
     * @param idFournisseur
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatsByFournisseur(
        idFournisseur: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/fournisseur/{idFournisseur}',
            path: {
                'idFournisseur': idFournisseur,
            },
        });
    }
    /**
     * Récupérer les bons d'achat par fournisseur et statut
     * @param idFournisseur
     * @param statut
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatsByFournisseurAndStatut(
        idFournisseur: string,
        statut: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/fournisseur/{idFournisseur}/statut/{statut}',
            path: {
                'idFournisseur': idFournisseur,
                'statut': statut,
            },
        });
    }
    /**
     * Récupérer les bons d'achat par devise
     * @param devise
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatsByDevise(
        devise: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/devise/{devise}',
            path: {
                'devise': devise,
            },
        });
    }
    /**
     * Récupérer les bons d'achat par période de livraison
     * @param startDate
     * @param endDate
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatsByDateLivraison(
        startDate: string,
        endDate: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/date-livraison',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * Récupérer les bons d'achat par période
     * @param startDate
     * @param endDate
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatsByDateAchat(
        startDate: string,
        endDate: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/date-achat',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * Compter les bons d'achat par statut
     * @param statut
     * @returns number OK
     * @throws ApiError
     */
    public static countByStatut2(
        statut: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/count/statut/{statut}',
            path: {
                'statut': statut,
            },
        });
    }
    /**
     * Compter les bons d'achat par fournisseur
     * @param idFournisseur
     * @returns number OK
     * @throws ApiError
     */
    public static countByFournisseur1(
        idFournisseur: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/count/fournisseur/{idFournisseur}',
            path: {
                'idFournisseur': idFournisseur,
            },
        });
    }
    /**
     * Récupérer les bons d'achat par bon de commande
     * @param idBonCommande
     * @returns BonAchatResponse OK
     * @throws ApiError
     */
    public static getBonAchatsByBonCommande(
        idBonCommande: string,
    ): CancelablePromise<Array<BonAchatResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/bons-achat/bon-commande/{idBonCommande}',
            path: {
                'idBonCommande': idBonCommande,
            },
        });
    }
}
