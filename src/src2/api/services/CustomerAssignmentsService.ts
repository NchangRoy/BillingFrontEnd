/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssignCustomerRequest } from '../models/AssignCustomerRequest';
import type { ClientResponse } from '../models/ClientResponse';
import type { CustomerAssignmentResponse } from '../models/CustomerAssignmentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CustomerAssignmentsService {
    /**
     * Assign (or reassign) a customer to a seller
     * @param requestBody
     * @returns CustomerAssignmentResponse OK
     * @throws ApiError
     */
    public static assign1(
        requestBody: AssignCustomerRequest,
    ): CancelablePromise<CustomerAssignmentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/customer-assignments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List all customer assignments for a seller
     * @param sellerId
     * @param organizationId
     * @returns CustomerAssignmentResponse OK
     * @throws ApiError
     */
    public static listBySeller2(
        sellerId: string,
        organizationId: string,
    ): CancelablePromise<Array<CustomerAssignmentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/customer-assignments/seller/{sellerId}',
            path: {
                'sellerId': sellerId,
            },
            query: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * Get the customers assigned to a seller
     * @param sellerId
     * @param organizationId
     * @returns ClientResponse OK
     * @throws ApiError
     */
    public static getCustomersForSeller(
        sellerId: string,
        organizationId: string,
    ): CancelablePromise<Array<ClientResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/customer-assignments/seller/{sellerId}/customers',
            path: {
                'sellerId': sellerId,
            },
            query: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * List all customer assignments for an organization
     * @param organizationId
     * @returns CustomerAssignmentResponse OK
     * @throws ApiError
     */
    public static listByOrganization1(
        organizationId: string,
    ): CancelablePromise<Array<CustomerAssignmentResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/customer-assignments/organisation/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * Get the current assignment for a customer
     * @param clientId
     * @param organizationId
     * @returns CustomerAssignmentResponse OK
     * @throws ApiError
     */
    public static getForClient(
        clientId: string,
        organizationId: string,
    ): CancelablePromise<CustomerAssignmentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/customer-assignments/client/{clientId}',
            path: {
                'clientId': clientId,
            },
            query: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * Remove a customer's seller assignment
     * @param clientId
     * @param organizationId
     * @returns void
     * @throws ApiError
     */
    public static unassign1(
        clientId: string,
        organizationId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/customer-assignments/client/{clientId}',
            path: {
                'clientId': clientId,
            },
            query: {
                'organizationId': organizationId,
            },
        });
    }
}
