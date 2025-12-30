/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClientUpdateRequest = {
    username?: string;
    categorie?: string;
    siteWeb?: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    typeClient?: ClientUpdateRequest.typeClient;
    raisonSociale?: string;
    numeroTva?: string;
    codeClient?: string;
    limiteCredit?: number;
    actif?: boolean;
    ntva?: boolean;
};
export namespace ClientUpdateRequest {
    export enum typeClient {
        PARTICULIER = 'PARTICULIER',
        ENTREPRISE = 'ENTREPRISE',
        ADMINISTRATION = 'ADMINISTRATION',
    }
}

