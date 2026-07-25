/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ContactResponse = {
    id?: string;
    name?: string;
    email?: string;
    organizationId?: string;
    status?: ContactResponse.status;
    linked?: boolean;
    createdAt?: string;
};
export namespace ContactResponse {
    export enum status {
        PENDING = 'PENDING',
        ACTIVE = 'ACTIVE',
        BLOCKED_BY_ADMIN = 'BLOCKED_BY_ADMIN',
        BLOCKED_BY_USER = 'BLOCKED_BY_USER',
    }
}
