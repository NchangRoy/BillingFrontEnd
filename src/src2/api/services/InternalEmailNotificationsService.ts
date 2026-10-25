/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SendClientPortalInvitationEmailRequest } from '../models/SendClientPortalInvitationEmailRequest';
import type { SendContactInvitationEmailRequest } from '../models/SendContactInvitationEmailRequest';
import type { SendSellerInvitationEmailRequest } from '../models/SendSellerInvitationEmailRequest';
import type { SendSessionCreatedEmailRequest } from '../models/SendSessionCreatedEmailRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InternalEmailNotificationsService {
    /**
     * Notify a seller that their POS session was created
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static sendSessionCreated(
        requestBody: SendSessionCreatedEmailRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/email/session-created',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send a seller invitation email with temporary credentials
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static sendSellerInvitation(
        requestBody: SendSellerInvitationEmailRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/email/seller-invitation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Invite a contact to activate Telegram notifications
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static sendContactInvitation(
        requestBody: SendContactInvitationEmailRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/email/contact-invitation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Send client-portal login credentials to a new account
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static sendClientPortalInvitation(
        requestBody: SendClientPortalInvitationEmailRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/email/client-portal-invitation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
