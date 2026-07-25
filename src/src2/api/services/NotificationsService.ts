/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddContactRequest } from '../models/AddContactRequest';
import type { ContactResponse } from '../models/ContactResponse';
import type { CreateLiveNotificationRequest } from '../models/CreateLiveNotificationRequest';
import type { LiveNotificationResponse } from '../models/LiveNotificationResponse';
import type { UpdateDelayRequest } from '../models/UpdateDelayRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
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
     * Stop notifying a contact
     * @param id
     * @throws ApiError
     */
    public static blockContact(
        id: string,
    ): CancelablePromise<void> {
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
     * @throws ApiError
     */
    public static removeContact(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/notifications/contacts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Create a notification for the caller's organization: contacts + flush delay
     * @param requestBody
     * @returns LiveNotificationResponse Created
     * @throws ApiError
     */
    public static createLiveNotification(
        requestBody: CreateLiveNotificationRequest,
    ): CancelablePromise<LiveNotificationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/live-notifications',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Change how long the notification batches invoices before flushing
     * @param id
     * @param requestBody
     * @returns LiveNotificationResponse OK
     * @throws ApiError
     */
    public static updateDelay(
        id: string,
        requestBody: UpdateDelayRequest,
    ): CancelablePromise<LiveNotificationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/notifications/live-notifications/{id}/delay',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
