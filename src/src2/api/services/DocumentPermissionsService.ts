/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignDocPermissionRequest } from '../models/AssignDocPermissionRequest';
import type { DocPermissionResponse } from '../models/DocPermissionResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DocumentPermissionsService {
    /**
     * Grant (or update) a seller's permission on a document
     * @param requestBody
     * @returns DocPermissionResponse OK
     * @throws ApiError
     */
    public static grant(
        requestBody: AssignDocPermissionRequest,
    ): CancelablePromise<DocPermissionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doc-permissions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Share a document with a seller at the given permission level, emailing them a notification. Sharing as OWNER transfers ownership away from whoever held it before.
     * @param requestBody
     * @returns DocPermissionResponse OK
     * @throws ApiError
     */
    public static share(
        requestBody: AssignDocPermissionRequest,
    ): CancelablePromise<DocPermissionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/doc-permissions/share',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List all document permissions granted to a seller
     * @param sellerId
     * @returns DocPermissionResponse OK
     * @throws ApiError
     */
    public static listBySeller1(
        sellerId: string,
    ): CancelablePromise<Array<DocPermissionResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doc-permissions/seller/{sellerId}',
            path: {
                'sellerId': sellerId,
            },
        });
    }
    /**
     * Get a seller's permission on a specific document
     * @param sellerId
     * @param docId
     * @param docType
     * @returns DocPermissionResponse OK
     * @throws ApiError
     */
    public static getForSellerAndDoc(
        sellerId: string,
        docId: string,
        docType: 'DEVIS' | 'FACTURE' | 'FACTURE_PROFORMA' | 'BACK_ORDER' | 'NOTE_CREDIT' | 'BON_ACHAT' | 'BON_COMMANDE' | 'BON_LIVRAISON' | 'BON_RECEPTION' | 'FACTURE_FOURNISSEUR',
    ): CancelablePromise<DocPermissionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doc-permissions/seller/{sellerId}/doc/{docId}',
            path: {
                'sellerId': sellerId,
                'docId': docId,
            },
            query: {
                'docType': docType,
            },
        });
    }
    /**
     * Revoke a seller's permission on a document
     * @param sellerId
     * @param docId
     * @param docType
     * @returns void
     * @throws ApiError
     */
    public static revoke(
        sellerId: string,
        docId: string,
        docType: 'DEVIS' | 'FACTURE' | 'FACTURE_PROFORMA' | 'BACK_ORDER' | 'NOTE_CREDIT' | 'BON_ACHAT' | 'BON_COMMANDE' | 'BON_LIVRAISON' | 'BON_RECEPTION' | 'FACTURE_FOURNISSEUR',
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/doc-permissions/seller/{sellerId}/doc/{docId}',
            path: {
                'sellerId': sellerId,
                'docId': docId,
            },
            query: {
                'docType': docType,
            },
        });
    }
    /**
     * List all sellers with a permission on a document
     * @param docId
     * @param docType
     * @returns DocPermissionResponse OK
     * @throws ApiError
     */
    public static listByDoc(
        docId: string,
        docType: 'DEVIS' | 'FACTURE' | 'FACTURE_PROFORMA' | 'BACK_ORDER' | 'NOTE_CREDIT' | 'BON_ACHAT' | 'BON_COMMANDE' | 'BON_LIVRAISON' | 'BON_RECEPTION' | 'FACTURE_FOURNISSEUR',
    ): CancelablePromise<Array<DocPermissionResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/doc-permissions/doc/{docId}',
            path: {
                'docId': docId,
            },
            query: {
                'docType': docType,
            },
        });
    }
}
