// Hand-written — these two endpoints aren't in the generated client yet
// (adding them would require a full `npm run generate:api`, which
// renumbers unrelated duplicate-operation methods across the whole app).
// Mirrors the exact request shape SellerAdminService.ts itself uses so auth
// (OpenAPI.TOKEN / X-Organization-ID) behaves identically.
import type { CreateSellerRequest } from "@/src/src2/api/models/CreateSellerRequest";
import type { CreateSellerResponse } from "@/src/src2/api/models/CreateSellerResponse";
import type { CancelablePromise } from "@/src/src2/api/core/CancelablePromise";
import { OpenAPI } from "@/src/src2/api/core/OpenAPI";
import { request as __request } from "@/src/src2/api/core/request";

export type OrganizationEmployeeResponse = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  status?: string;
  alreadySeller?: boolean;
};

export const listOrganizationEmployees = (organizationId: string): CancelablePromise<Array<OrganizationEmployeeResponse>> =>
  __request(OpenAPI, {
    method: "GET",
    url: "/api/sellers/employees",
    query: { organizationId },
  });

export const createSellerFromEmployee = (requestBody: CreateSellerRequest): CancelablePromise<CreateSellerResponse> =>
  __request(OpenAPI, {
    method: "POST",
    url: "/api/sellers/from-employee",
    body: requestBody,
    mediaType: "application/json",
  });
