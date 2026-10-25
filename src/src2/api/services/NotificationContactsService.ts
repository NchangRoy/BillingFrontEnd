/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddContactRequest } from '../models/AddContactRequest';
import type { ContactResponse } from '../models/ContactResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationContactsService {
    /**
     * List contacts for the caller's organization
     * @returns ContactResponse OK
     * @throws ApiError
     */
    public static listContacts(): CancelablePromise<Array<ContactResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/notifications/contacts',
        });
    }
    /**
     * Add a contact and email them a Telegram invite link
     * @param requestBody
     * @returns ContactResponse Created
     * @throws ApiError
     */
    public static addContact(
        requestBody: AddContactRequest,
    ): CancelablePromise<ContactResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/contacts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Stop notifying a contact
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static blockContact(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/contacts/{id}/block',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Remove a contact
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static removeContact(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/notifications/contacts/{id}',
            path: {
                'id': id,
            },
        });
    }
}
