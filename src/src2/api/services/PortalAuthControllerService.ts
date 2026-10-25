/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PortalLoginRequest } from '../models/PortalLoginRequest';
import type { PortalLoginResponse } from '../models/PortalLoginResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PortalAuthControllerService {
    /**
     * @param requestBody
     * @returns PortalLoginResponse OK
     * @throws ApiError
     */
    public static login(
        requestBody: PortalLoginRequest,
    ): CancelablePromise<PortalLoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/portal/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
