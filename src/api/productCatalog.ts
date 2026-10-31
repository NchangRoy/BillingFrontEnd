// Hand-written — none of these endpoints are in the generated client yet
// (adding them would require a full `npm run generate:api`, which renumbers
// unrelated duplicate-operation methods across the whole app).
import type { CancelablePromise } from "@/src/src2/api/core/CancelablePromise";
import { OpenAPI } from "@/src/src2/api/core/OpenAPI";
import { request as __request } from "@/src/src2/api/core/request";
import type { ProductDefinitionResponse } from "@/src/api/productDefinitions";

export type UomResponse = {
  id?: string;
  code?: string;
  name?: string;
  symbol?: string;
  dimension?: string;
  baseFactor?: number;
  base?: boolean;
};

export type CreateUomRequest = {
  code: string;
  name: string;
  symbol?: string;
  dimension: string;
  baseFactor?: number;
};

export type CategoryResponse = {
  id?: string;
  parentCategoryId?: string;
  code?: string;
  name?: string;
  path?: string;
  status?: string;
};

export type CreateCategoryRequest = {
  code: string;
  name: string;
  parentId?: string;
};

export type DefineProductRequest = {
  globalCode: string;
  name: string;
  nature: "TANGIBLE" | "INTANGIBLE";
  articleKind?: "RAW_MATERIAL" | "SEMI_FINISHED" | "FINISHED";
  defaultUomId: string;
  shortDescription?: string;
};

export const listUoms = (): CancelablePromise<Array<UomResponse>> =>
  __request(OpenAPI, { method: "GET", url: "/api/product-catalog/units" });

export const createUom = (requestBody: CreateUomRequest): CancelablePromise<UomResponse> =>
  __request(OpenAPI, { method: "POST", url: "/api/product-catalog/units", body: requestBody, mediaType: "application/json" });

export const listCategories = (): CancelablePromise<Array<CategoryResponse>> =>
  __request(OpenAPI, { method: "GET", url: "/api/product-catalog/categories" });

export const createCategory = (requestBody: CreateCategoryRequest): CancelablePromise<CategoryResponse> =>
  __request(OpenAPI, { method: "POST", url: "/api/product-catalog/categories", body: requestBody, mediaType: "application/json" });

export const defineProduct = (requestBody: DefineProductRequest): CancelablePromise<ProductDefinitionResponse> =>
  __request(OpenAPI, { method: "POST", url: "/api/product-catalog/products", body: requestBody, mediaType: "application/json" });

export const categorizeProduct = (productId: string, categoryId: string): CancelablePromise<void> =>
  __request(OpenAPI, {
    method: "PUT",
    url: "/api/product-catalog/products/{productId}/category",
    path: { productId },
    body: { categoryId },
    mediaType: "application/json",
  });
