/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Pageable } from '../models/Pageable';
import type { PageProduitResponse } from '../models/PageProduitResponse';
import type { ProduitCreateRequest } from '../models/ProduitCreateRequest';
import type { ProduitResponse } from '../models/ProduitResponse';
import type { ProduitUpdateRequest } from '../models/ProduitUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProduitService {
    /**
     * Récupérer un produit par ID
     * @param produitId
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static getProduitById(
        produitId: string,
    ): CancelablePromise<ProduitResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/{produitId}',
            path: {
                'produitId': produitId,
            },
        });
    }
    /**
     * Mettre à jour un produit
     * @param produitId
     * @param requestBody
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static updateProduit(
        produitId: string,
        requestBody: ProduitUpdateRequest,
    ): CancelablePromise<ProduitResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/produits/{produitId}',
            path: {
                'produitId': produitId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer un produit
     * @param produitId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteProduit(
        produitId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/produits/{produitId}',
            path: {
                'produitId': produitId,
            },
        });
    }
    /**
     * Désactiver un produit
     * @param produitId
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static desactiverProduit(
        produitId: string,
    ): CancelablePromise<ProduitResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/produits/{produitId}/desactiver',
            path: {
                'produitId': produitId,
            },
        });
    }
    /**
     * Activer un produit
     * @param produitId
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static activerProduit(
        produitId: string,
    ): CancelablePromise<ProduitResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/produits/{produitId}/activer',
            path: {
                'produitId': produitId,
            },
        });
    }
    /**
     * Récupérer tous les produits
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static getAllProduits(): CancelablePromise<Array<ProduitResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits',
        });
    }
    /**
     * Créer un nouveau produit
     * @param requestBody
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static createProduit(
        requestBody: ProduitCreateRequest,
    ): CancelablePromise<ProduitResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/produits',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Récupérer les produits par type
     * @param typeProduit
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static getProduitsByType(
        typeProduit: string,
    ): CancelablePromise<Array<ProduitResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/type/{typeProduit}',
            path: {
                'typeProduit': typeProduit,
            },
        });
    }
    /**
     * Rechercher des produits par nom
     * @param nom
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static searchProduitsByNom(
        nom: string,
    ): CancelablePromise<Array<ProduitResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/search',
            query: {
                'nom': nom,
            },
        });
    }
    /**
     * Récupérer un produit par référence
     * @param reference
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static getProduitByReference(
        reference: string,
    ): CancelablePromise<ProduitResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/reference/{reference}',
            path: {
                'reference': reference,
            },
        });
    }
    /**
     * Récupérer les produits par fourchette de prix
     * @param minPrice
     * @param maxPrice
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static getProduitsByPriceRange(
        minPrice: number,
        maxPrice: number,
    ): CancelablePromise<Array<ProduitResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/prix-range',
            query: {
                'minPrice': minPrice,
                'maxPrice': maxPrice,
            },
        });
    }
    /**
     * Récupérer tous les produits avec pagination
     * @param pageable
     * @returns PageProduitResponse OK
     * @throws ApiError
     */
    public static getAllProduitsPaginated(
        pageable: Pageable,
    ): CancelablePromise<PageProduitResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/page',
            query: {
                'pageable': pageable,
            },
        });
    }
    /**
     * Compter les produits par type
     * @param typeProduit
     * @returns number OK
     * @throws ApiError
     */
    public static countByType1(
        typeProduit: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/count/type/{typeProduit}',
            path: {
                'typeProduit': typeProduit,
            },
        });
    }
    /**
     * Compter les produits par catégorie
     * @param categorie
     * @returns number OK
     * @throws ApiError
     */
    public static countByCategorie(
        categorie: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/count/categorie/{categorie}',
            path: {
                'categorie': categorie,
            },
        });
    }
    /**
     * Récupérer un produit par code-barre
     * @param codeBarre
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static getProduitByCodeBarre(
        codeBarre: string,
    ): CancelablePromise<ProduitResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/code-barre/{codeBarre}',
            path: {
                'codeBarre': codeBarre,
            },
        });
    }
    /**
     * Récupérer les produits par catégorie
     * @param categorie
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static getProduitsByCategorie(
        categorie: string,
    ): CancelablePromise<Array<ProduitResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/categorie/{categorie}',
            path: {
                'categorie': categorie,
            },
        });
    }
    /**
     * Récupérer tous les produits actifs
     * @returns ProduitResponse OK
     * @throws ApiError
     */
    public static getActiveProduits(): CancelablePromise<Array<ProduitResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/produits/actifs',
        });
    }
}
