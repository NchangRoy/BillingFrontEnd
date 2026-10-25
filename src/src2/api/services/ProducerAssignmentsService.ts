/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignProducerRequest } from '../models/AssignProducerRequest';
import type { FournisseurResponse } from '../models/FournisseurResponse';
import type { ProducerAssignmentResponse } from '../models/ProducerAssignmentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProducerAssignmentsService {
    /**
     * Assign (or reassign) a producer to a seller
     * @param requestBody
     * @returns ProducerAssignmentResponse OK
     * @throws ApiError
     */
    public static assign(
        requestBody: AssignProducerRequest,
    ): CancelablePromise<ProducerAssignmentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/producer-assignments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List all producer assignments for a seller
     * @param sellerId
     * @param organizationId
     * @returns ProducerAssignmentResponse OK
     * @throws ApiError
     */
    public static listBySeller(
        sellerId: string,
        organizationId: string,
    ): CancelablePromise<Array<ProducerAssignmentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/producer-assignments/seller/{sellerId}',
            path: {
                'sellerId': sellerId,
            },
            query: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * Get the producers/suppliers assigned to a seller
     * @param sellerId
     * @param organizationId
     * @returns FournisseurResponse OK
     * @throws ApiError
     */
    public static getProducersForSeller(
        sellerId: string,
        organizationId: string,
    ): CancelablePromise<Array<FournisseurResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/producer-assignments/seller/{sellerId}/producers',
            path: {
                'sellerId': sellerId,
            },
            query: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * List all producer assignments for an organization
     * @param organizationId
     * @returns ProducerAssignmentResponse OK
     * @throws ApiError
     */
    public static listByOrganization(
        organizationId: string,
    ): CancelablePromise<Array<ProducerAssignmentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/producer-assignments/organisation/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * Get the current assignment for a producer
     * @param fournisseurId
     * @param organizationId
     * @returns ProducerAssignmentResponse OK
     * @throws ApiError
     */
    public static getForFournisseur(
        fournisseurId: string,
        organizationId: string,
    ): CancelablePromise<ProducerAssignmentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/producer-assignments/fournisseur/{fournisseurId}',
            path: {
                'fournisseurId': fournisseurId,
            },
            query: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * Remove a producer's seller assignment
     * @param fournisseurId
     * @param organizationId
     * @returns void
     * @throws ApiError
     */
    public static unassign(
        fournisseurId: string,
        organizationId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/producer-assignments/fournisseur/{fournisseurId}',
            path: {
                'fournisseurId': fournisseurId,
            },
            query: {
                'organizationId': organizationId,
            },
        });
    }
}
