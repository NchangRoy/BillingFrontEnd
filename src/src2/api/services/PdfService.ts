/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RenderPdfRequest } from '../models/RenderPdfRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PdfService {
    /**
     * Render HTML (built client-side for print) into a downloadable PDF
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static render(
        requestBody: RenderPdfRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/pdf/render',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
