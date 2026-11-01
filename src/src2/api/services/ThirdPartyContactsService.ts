/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddThirdPartyContactRequest } from '../models/AddThirdPartyContactRequest';
import type { ThirdPartyContactResponse } from '../models/ThirdPartyContactResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ThirdPartyContactsService {
    /**
     * List a third party's contacts (name + email) for the send-document contact picker
     * @param thirdPartyId
     * @returns ThirdPartyContactResponse OK
     * @throws ApiError
     */
    public static getThirdPartyContacts(
        thirdPartyId: string,
    ): CancelablePromise<Array<ThirdPartyContactResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tiers/third-parties/{thirdPartyId}/contacts',
            path: {
                'thirdPartyId': thirdPartyId,
            },
        });
    }
    /**
     * Add a new contact (name + email) for a third party
     * @param thirdPartyId
     * @param requestBody
     * @returns ThirdPartyContactResponse Created
     * @throws ApiError
     */
    public static addThirdPartyContact(
        thirdPartyId: string,
        requestBody: AddThirdPartyContactRequest,
    ): CancelablePromise<ThirdPartyContactResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tiers/third-parties/{thirdPartyId}/contacts',
            path: {
                'thirdPartyId': thirdPartyId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
