/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AssignDocPermissionRequest = {
    sellerId: string;
    docId: string;
    docType: AssignDocPermissionRequest.docType;
    permission: AssignDocPermissionRequest.permission;
    recipientEmail?: string;
    recipientName?: string;
    sharedByName?: string;
    docLabel?: string;
};
export namespace AssignDocPermissionRequest {
    export enum docType {
        DEVIS = 'DEVIS',
        FACTURE = 'FACTURE',
        FACTURE_PROFORMA = 'FACTURE_PROFORMA',
        BACK_ORDER = 'BACK_ORDER',
        NOTE_CREDIT = 'NOTE_CREDIT',
        BON_ACHAT = 'BON_ACHAT',
        BON_COMMANDE = 'BON_COMMANDE',
        BON_LIVRAISON = 'BON_LIVRAISON',
        BON_RECEPTION = 'BON_RECEPTION',
        FACTURE_FOURNISSEUR = 'FACTURE_FOURNISSEUR',
    }
    export enum permission {
        OWNER = 'OWNER',
        EDITOR = 'EDITOR',
        VIEWER = 'VIEWER',
    }
}

