/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateLiveNotificationRequest } from '../models/CreateLiveNotificationRequest';
import type { LiveNotificationResponse } from '../models/LiveNotificationResponse';
import type { UpdateActiveRequest } from '../models/UpdateActiveRequest';
import type { UpdateDelayRequest } from '../models/UpdateDelayRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LiveNotificationsService {
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
    /**
     * Turn a notification rule on or off. Turning a TELEGRAM rule on (re)sends the bot invite to any unlinked contact.
     * @param id
     * @param requestBody
     * @returns LiveNotificationResponse OK
     * @throws ApiError
     */
    public static setActive(
        id: string,
        requestBody: UpdateActiveRequest,
    ): CancelablePromise<LiveNotificationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/notifications/live-notifications/{id}/active',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Create a notification for the caller's organization: contacts + flush delay
     * @param requestBody
     * @returns LiveNotificationResponse Created
     * @throws ApiError
     */
    public static create3(
        requestBody: CreateLiveNotificationRequest,
    ): CancelablePromise<LiveNotificationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/live-notifications',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
