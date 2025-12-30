/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FournisseurCreateRequest } from '../models/FournisseurCreateRequest';
import type { FournisseurResponse } from '../models/FournisseurResponse';
import type { FournisseurUpdateRequest } from '../models/FournisseurUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FournisseurService {
    /**
     * Récupérer un fournisseur par ID
     * @param fournisseurId
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static getFournisseurById(
        fournisseurId: string,
    ): CancelablePromise<FournisseurResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fournisseurs/{fournisseurId}',
            path: {
                'fournisseurId': fournisseurId,
            },
        });
    }
    /**
     * Mettre à jour un fournisseur
     * @param fournisseurId
     * @param requestBody
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static updateFournisseur(
        fournisseurId: string,
        requestBody: FournisseurUpdateRequest,
    ): CancelablePromise<FournisseurResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/fournisseurs/{fournisseurId}',
            path: {
                'fournisseurId': fournisseurId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer un fournisseur
     * @param fournisseurId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteFournisseur(
        fournisseurId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/fournisseurs/{fournisseurId}',
            path: {
                'fournisseurId': fournisseurId,
            },
        });
    }
    /**
     * Mettre à jour le solde d'un fournisseur
     * @param fournisseurId
     * @param montant
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static updateSolde(
        fournisseurId: string,
        montant: number,
    ): CancelablePromise<FournisseurResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/fournisseurs/{fournisseurId}/solde',
            path: {
                'fournisseurId': fournisseurId,
            },
            query: {
                'montant': montant,
            },
        });
    }
    /**
     * Désactiver un fournisseur
     * @param fournisseurId
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static desactiverFournisseur(
        fournisseurId: string,
    ): CancelablePromise<FournisseurResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/fournisseurs/{fournisseurId}/desactiver',
            path: {
                'fournisseurId': fournisseurId,
            },
        });
    }
    /**
     * Activer un fournisseur
     * @param fournisseurId
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static activerFournisseur(
        fournisseurId: string,
    ): CancelablePromise<FournisseurResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/fournisseurs/{fournisseurId}/activer',
            path: {
                'fournisseurId': fournisseurId,
            },
        });
    }
    /**
     * Récupérer tous les fournisseurs
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static getAllFournisseurs(): CancelablePromise<Array<FournisseurResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fournisseurs',
        });
    }
    /**
     * Créer un nouveau fournisseur
     * @param requestBody
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static createFournisseur(
        requestBody: FournisseurCreateRequest,
    ): CancelablePromise<FournisseurResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/fournisseurs',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Récupérer un fournisseur par username
     * @param username
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static getFournisseurByUsername(
        username: string,
    ): CancelablePromise<FournisseurResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fournisseurs/username/{username}',
            path: {
                'username': username,
            },
        });
    }
    /**
     * Compter les fournisseurs actifs
     * @returns number OK
     * @throws ApiError
     */
    public static countActiveFournisseurs(): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fournisseurs/count/actifs',
        });
    }
    /**
     * Récupérer les fournisseurs par catégorie
     * @param categorie
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static getFournisseursByCategorie(
        categorie: string,
    ): CancelablePromise<Array<FournisseurResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fournisseurs/categorie/{categorie}',
            path: {
                'categorie': categorie,
            },
        });
    }
    /**
     * Récupérer tous les fournisseurs actifs
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static getActiveFournisseurs(): CancelablePromise<Array<FournisseurResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fournisseurs/actifs',
        });
    }
}
