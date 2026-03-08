import { UpdatedSellerResponse } from "../api/models/UpdatedSellerResponse";
import { SellerAuthResponse } from "../src2/api/services/ExternalServices.ts/SellerAuthResponse";

/**
 * Converts a SellerAuthResponse (Backend DTO) to UpdatedSellerResponse (Frontend Model)
 * Handles field renaming and data flattening.
 */
export const mapAuthToUpdatedSeller = (data: SellerAuthResponse): UpdatedSellerResponse => {
  return {
    // Basic Info & Renaming
    Id: data.id,
    username: data.username,
    agency: data.agencyName,       // Mapping agencyName to agency
    salePoint: data.salesPointName, // Mapping salesPointName to salePoint
    
    // Collections
    Permissions: data.permissions,
    permittedSaleSizes: data.permittedSaleSizes,

    // Organization Info (The Company)
    organizationId: data.organizationId,
    organizationName: data.organizationName,
    organizationLogoUri: data.organizationLogoUri ?? '', // Ensure string, not null
    organizationEmail: data.organizationEmail,
    taxNumber: data.taxNumber ?? '',

    // Agency Info (The Branch)
    agencyId: data.agencyId,
    agencyEmail: data.agencyEmail ?? '',
    agencyPhone: data.agencyPhone ?? '',
    agencyCity: data.agencyCity,
    agencyAddress: data.agencyAddress,

    // Sales Point Info
    salesPointId: data.salesPointId,
    salesPointAddress: data.salesPointAddress,

    // Meta
    createdAt: data.createdAt
  };
};