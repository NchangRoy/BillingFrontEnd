// Hand-written — neither endpoint is in the generated client yet (adding them
// would require a full `npm run generate:api`, which renumbers unrelated
// duplicate-operation methods across the whole app). Mirrors the request
// shape ProductsService.ts itself uses so auth (OpenAPI.TOKEN /
// X-Organization-ID) behaves identically.
import type { ProductResponse } from "@/src/src2/api/models/ProductResponse";
import type { CancelablePromise } from "@/src/src2/api/core/CancelablePromise";
import { OpenAPI } from "@/src/src2/api/core/OpenAPI";
import { request as __request } from "@/src/src2/api/core/request";

/** Extends the generated ProductResponse with fields it doesn't declare yet
 * (productNumber) — the backend already serializes it, the generated model's
 * just stale (see note above re: not regenerating casually). */
export type ProductResponseWithNumber = ProductResponse & { productNumber?: string };

export type ProductDefinitionResponse = {
  id?: string;
  globalCode?: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  nature?: "TANGIBLE" | "INTANGIBLE";
  articleKind?: string;
  lifecycleStatus?: string;
  defaultUomId?: string;
  categoryId?: string;
  launchDate?: string;
  discontinueDate?: string;
};

export type CreateProductRequest = {
  reference: string;
  nomProduit: string;
  typeProduit?: string;
  categorie?: string;
  codeBarre?: string;
  uom?: string;
  photo?: string;
  prixVente?: number;
  cout?: number;
  currency?: string;
  quantity?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  vatApplicable?: boolean;
  /** The generated numbering code (category/unit/VAT/date/sequence), computed client-side —
   * distinct from "reference" (Kernel's globalCode). */
  productNumber?: string;
};

// The organization's catalog of defined products (no price/stock) — used to
// let a seller pick an existing product rather than typing a fresh
// reference/globalCode that may not match anything already on file.
export const getProductDefinitions = (): CancelablePromise<Array<ProductDefinitionResponse>> =>
  __request(OpenAPI, {
    method: "GET",
    url: "/api/products/definitions",
  });

export const createProduct = (requestBody: CreateProductRequest): CancelablePromise<ProductResponseWithNumber> =>
  __request(OpenAPI, {
    method: "POST",
    url: "/api/products",
    body: requestBody,
    mediaType: "application/json",
  });
