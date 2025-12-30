/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FournisseurCreateRequest = {
    username: string;
    categorie: string;
    siteWeb?: string;
    adresse: string;
    telephone?: string;
    email?: string;
    typeFournisseur: FournisseurCreateRequest.typeFournisseur;
    raisonSociale?: string;
    numeroTva?: string;
    codeFournisseur?: string;
    limiteCredit?: number;
    actif?: boolean;
    ntva?: boolean;
};
export namespace FournisseurCreateRequest {
    export enum typeFournisseur {
        PARTICULIER = 'PARTICULIER',
        ENTREPRISE = 'ENTREPRISE',
        ADMINISTRATION = 'ADMINISTRATION',
    }
}

