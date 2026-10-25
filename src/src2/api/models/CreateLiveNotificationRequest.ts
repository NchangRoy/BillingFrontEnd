/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateLiveNotificationRequest = {
    contactIds?: Array<string>;
    delayMinutes?: number;
    channel?: CreateLiveNotificationRequest.channel;
    active?: boolean;
    organizationId?: string;
};
export namespace CreateLiveNotificationRequest {
    export enum channel {
        TELEGRAM = 'TELEGRAM',
        EMAIL = 'EMAIL',
    }
}

