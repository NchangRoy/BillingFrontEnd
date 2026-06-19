/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProductResponse = {
    idProduit?: string;
    nomProduit?: string;
    typeProduit?: string;
    prixVente?: number;
    cout?: number;
    categorie?: string;
    reference?: string;
    codeBarre?: string;
    photo?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
    uom?: string;
    availableQuantity?: number;
    reservedQuantity?: number;
    stockQuantity?: number;
    organizationId?: string;
    allowedSaleSizes?: Array<{
        size?: string;
        unitPrice?: number;
        unitPriceWithTax?: number;
        minQuantity?: number;
        active?: boolean;
        isNegotiable?: boolean;
        minNegotiationPercentage?: number;
    }>;
    activePromotions?: Array<{
        saleSize?: string;
        startDate?: string;
        endDate?: string;
        promotionalPrice?: number;
        discountPercentage?: number;
        active?: boolean;
    }>;
};
