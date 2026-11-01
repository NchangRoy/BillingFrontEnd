/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProductRequest } from '../models/CreateProductRequest';
import type { ProductDefinitionResponse } from '../models/ProductDefinitionResponse';
import type { ProductResponse } from '../models/ProductResponse';
import type { UpdatePhotoRequest } from '../models/UpdatePhotoRequest';
import type { UpdateSaleSizesRequest } from '../models/UpdateSaleSizesRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductsService {
    /**
     * Configure a product's image, allowed sale sizes/pricing/negotiability, and VAT applicability
     * @param productId
     * @param requestBody
     * @returns ProductResponse OK
     * @throws ApiError
     */
    public static updateSaleSizes(
        productId: string,
        requestBody: UpdateSaleSizesRequest,
    ): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/products/{productId}/sale-sizes',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Set a product's photo URL
     * @param productId
     * @param requestBody
     * @returns string OK
     * @throws ApiError
     */
    public static updatePhoto1(
        productId: string,
        requestBody: UpdatePhotoRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/products/{productId}/photo',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get all products
     * @returns ProductResponse OK
     * @throws ApiError
     */
    public static getAllProducts(): CancelablePromise<Array<ProductResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products',
        });
    }
    /**
     * Create a new product in the organization's catalog
     * @param requestBody
     * @returns ProductResponse OK
     * @throws ApiError
     */
    public static createProduct(
        requestBody: CreateProductRequest,
    ): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/products',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get product by ID
     * @param productId
     * @returns ProductResponse OK
     * @throws ApiError
     */
    public static getProductById(
        productId: string,
    ): CancelablePromise<ProductResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products/{productId}',
            path: {
                'productId': productId,
            },
        });
    }
    /**
     * Get products by organization
     * @param organizationId
     * @returns ProductResponse OK
     * @throws ApiError
     */
    public static getProductsByOrganization(
        organizationId: string,
    ): CancelablePromise<Array<ProductResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products/organization/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
        });
    }
    /**
     * List the organization's catalog of defined products (no price/stock — for picking an existing one to provision as sellable)
     * @returns ProductDefinitionResponse OK
     * @throws ApiError
     */
    public static getProductDefinitions(): CancelablePromise<Array<ProductDefinitionResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products/definitions',
        });
    }
}
