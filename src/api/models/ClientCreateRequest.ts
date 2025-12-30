/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClientCreateRequest = {
    username: string;
    categorie: string;
    siteWeb?: string;
    adresse: string;
    telephone?: string;
    email?: string;
    typeClient: ClientCreateRequest.typeClient;
    raisonSociale?: string;
    numeroTva?: string;
    codeClient?: string;
    limiteCredit?: number;
    actif?: boolean;
    ntva?: boolean;
};
export namespace ClientCreateRequest {
    export enum typeClient {
        PARTICULIER = 'PARTICULIER',
        ENTREPRISE = 'ENTREPRISE',
        ADMINISTRATION = 'ADMINISTRATION',
    }
}

