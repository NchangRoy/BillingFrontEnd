/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { MfaConfirmRequest } from '../models/MfaConfirmRequest';
import type { PinLoginRequest } from '../models/PinLoginRequest';
import type { SellerAuthResponse } from '../models/SellerAuthResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Try Out login
     * Authenticates directly against Kernel using the org the account already belongs to, auto-provisioning a local seller on first use. Does not create new organizations.
     * @param requestBody
     * @returns SellerAuthResponse OK
     * @throws ApiError
     */
    public static tryOut(
        requestBody: LoginRequest,
    ): CancelablePromise<SellerAuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/try-out',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Seller login
     * Returns full seller profile with org and agency details on success.
     * @param requestBody
     * @returns SellerAuthResponse OK
     * @throws ApiError
     */
    public static login1(
        requestBody: LoginRequest,
    ): CancelablePromise<SellerAuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Confirm MFA
     * Second step of login/try-out: confirms the emailed OTP code with the mfaToken returned by /login or /try-out, and returns the same seller profile those would have returned directly.
     * @param requestBody
     * @returns SellerAuthResponse OK
     * @throws ApiError
     */
    public static confirmMfa(
        requestBody: MfaConfirmRequest,
    ): CancelablePromise<SellerAuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login/mfa',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Seller PIN login (local)
     * Quick POS-terminal login via organization + 5-digit PIN, resolved against Billing's own local SellerAuthContext store.
     * @param requestBody
     * @returns SellerAuthResponse OK
     * @throws ApiError
     */
    public static loginByLocalPin(
        requestBody: PinLoginRequest,
    ): CancelablePromise<SellerAuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login/by_pin',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
