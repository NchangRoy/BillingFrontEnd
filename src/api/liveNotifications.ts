// Hand-written — GET /api/notifications/live-notifications isn't in the
// generated client yet (adding it would require a full `npm run
// generate:api`, which renumbers unrelated duplicate-operation methods
// across the whole app). Mirrors sellerEmployees.ts's approach.
import type { LiveNotificationResponse } from "@/src/src2/api/models/LiveNotificationResponse";
import type { CancelablePromise } from "@/src/src2/api/core/CancelablePromise";
import { OpenAPI } from "@/src/src2/api/core/OpenAPI";
import { request as __request } from "@/src/src2/api/core/request";

export const listLiveNotifications = (): CancelablePromise<Array<LiveNotificationResponse>> =>
  __request(OpenAPI, {
    method: "GET",
    url: "/api/notifications/live-notifications",
  });
