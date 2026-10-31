// Hand-written — GET/PUT .../product-numbering aren't in the generated client
// yet, and includeCategory/includeUnit aren't on the generated SettingResponse
// model either (adding either would require a full `npm run generate:api`,
// which renumbers unrelated duplicate-operation methods across the whole app).
import type { CancelablePromise } from "@/src/src2/api/core/CancelablePromise";
import { OpenAPI } from "@/src/src2/api/core/OpenAPI";
import { request as __request } from "@/src/src2/api/core/request";

export type ProductNumberingSettings = {
  id?: string;
  organizationId?: string;
  includeCategory?: boolean;
  includeFamily?: boolean;
  includeUnit?: boolean;
  includeTva?: boolean;
  includeDate?: boolean;
  randomSeq4?: boolean;
  preview?: string;
};

export type UpdateProductNumberingRequest = {
  includeCategory?: boolean;
  includeFamily?: boolean;
  includeUnit?: boolean;
  includeTva?: boolean;
  includeDate?: boolean;
  randomSeq4?: boolean;
};

export const getProductNumberingSettings = (organizationId: string): CancelablePromise<ProductNumberingSettings> =>
  __request(OpenAPI, {
    method: "GET",
    url: "/api/settings/organization/{organizationId}/product-numbering",
    path: { organizationId },
  });

export const updateProductNumberingSettings = (
  organizationId: string,
  requestBody: UpdateProductNumberingRequest
): CancelablePromise<ProductNumberingSettings> =>
  __request(OpenAPI, {
    method: "PUT",
    url: "/api/settings/organization/{organizationId}/product-numbering",
    path: { organizationId },
    body: requestBody,
    mediaType: "application/json",
  });

/** Mirrors SettingService.composeProductNumber() on the backend — the frontend computes the
 * real globalCode itself (same convention as the other document numbers), this endpoint's
 * own "preview" field is only for the settings page's live sample.
 * Format: PROD-{category}-{family}-{tva}-{uom}-{random} — "PROD" is a fixed literal. */
export const composeProductNumber = (
  settings: ProductNumberingSettings,
  categoryCode: string | undefined,
  familyCode: string | undefined,
  unitCode: string | undefined,
  hasTva: boolean
): string => {
  const segments: string[] = ["PROD"];
  if (settings.includeCategory && categoryCode) segments.push(categoryCode.toUpperCase());
  if (settings.includeFamily && familyCode) segments.push(familyCode.toUpperCase());
  if (settings.includeTva) segments.push(hasTva ? "T" : "NT");
  if (settings.includeUnit && unitCode) segments.push(unitCode.toUpperCase());
  if (settings.randomSeq4) segments.push(String(Math.floor(Math.random() * 10000)).padStart(4, "0"));
  return segments.join("-");
};
