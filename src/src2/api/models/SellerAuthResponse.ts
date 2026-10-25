/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { KernelDiscoveredContext } from './KernelDiscoveredContext';
import type { KernelOrganizationResponse } from './KernelOrganizationResponse';
import type { SellerUIPermissionsResponse } from './SellerUIPermissionsResponse';
import type { SettingResponse } from './SettingResponse';
export type SellerAuthResponse = {
    accessToken?: string;
    username?: string;
    email?: string;
    role?: SellerAuthResponse.role;
    agency?: string;
    salePoint?: string;
    permittedSaleSizes?: Array<'DETAIL' | 'DEMIS_GROS' | 'GROS' | 'SUPER_GROS'>;
    organizationId?: string;
    organizationName?: string;
    organizationLogoUri?: string;
    organizationEmail?: string;
    taxNumber?: string;
    agencyId?: string;
    agencyEmail?: string;
    agencyPhone?: string;
    agencyCity?: string;
    agencyAddress?: string;
    salesPointId?: string;
    salesPointAddress?: string;
    createdAt?: string;
    mustChangePassword?: boolean;
    uiPermissions?: SellerUIPermissionsResponse;
    organizationSettings?: SettingResponse;
    documentNumberingSettings?: Array<SettingResponse>;
    requiresOrganizationSelection?: boolean;
    availableOrganizations?: Array<KernelOrganizationResponse>;
    requiresTenantSelection?: boolean;
    availableTenants?: Array<KernelDiscoveredContext>;
    mfaRequired?: boolean;
    mfaToken?: string;
    mfaChannel?: string;
    Id?: string;
    Permissions?: Array<'NEGOTIATE_PRICE' | 'APPLY_DISCOUNT' | 'OVERRIDE_PRICE' | 'APPROVE_DOCUMENT'>;
};
export namespace SellerAuthResponse {
    export enum role {
        POS_SELLER = 'POS_SELLER',
        SELLER = 'SELLER',
        AGENCY_MANAGER = 'AGENCY_MANAGER',
        OWNER = 'OWNER',
    }
}

