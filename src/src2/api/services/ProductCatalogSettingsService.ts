/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResponse } from '../models/CategoryResponse';
import type { CreateCategoryRequest } from '../models/CreateCategoryRequest';
import type { CreateUomRequest } from '../models/CreateUomRequest';
import type { DefineProductRequest } from '../models/DefineProductRequest';
import type { ProductDefinitionResponse } from '../models/ProductDefinitionResponse';
import type { UomResponse } from '../models/UomResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductCatalogSettingsService {
    /**
     * Assign a category to a catalog product
     * @param productId
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static categorizeProduct(
        productId: string,
        requestBody: Record<string, string>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/product-catalog/products/{productId}/category',
            path: {
                'productId': productId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List units of measure
     * @returns UomResponse OK
     * @throws ApiError
     */
    public static listUoms(): CancelablePromise<Array<UomResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/product-catalog/units',
        });
    }
    /**
     * Create a unit of measure
     * @param requestBody
     * @returns UomResponse OK
     * @throws ApiError
     */
    public static createUom(
        requestBody: CreateUomRequest,
    ): CancelablePromise<UomResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/product-catalog/units',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Define a new product in the catalog (not yet sellable — see POST /api/products to provision pricing/stock for it)
     * @param requestBody
     * @returns ProductDefinitionResponse OK
     * @throws ApiError
     */
    public static defineProduct(
        requestBody: DefineProductRequest,
    ): CancelablePromise<ProductDefinitionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/product-catalog/products',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List product categories
     * @returns CategoryResponse OK
     * @throws ApiError
     */
    public static listCategories(): CancelablePromise<Array<CategoryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/product-catalog/categories',
        });
    }
    /**
     * Create a product category
     * @param requestBody
     * @returns CategoryResponse OK
     * @throws ApiError
     */
    public static createCategory(
        requestBody: CreateCategoryRequest,
    ): CancelablePromise<CategoryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/product-catalog/categories',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
