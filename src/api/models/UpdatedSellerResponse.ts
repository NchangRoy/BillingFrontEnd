// -------------------------
// Sale size enum
// -------------------------
export enum SaleSize {
  DETAIL = 'DETAIL',
  DEMIS_GROS = 'DEMIS_GROS',
  GROS = 'GROS',
  SUPER_GROS = 'SUPER_GROS',
}

// -------------------------
//  permission enum
// -------------------------
export enum Permission {
  NEGOTIATE_PRICE = 'NEGOTIATE_PRICE',
  APPLY_DISCOUNT = 'APPLY_DISCOUNT',
  OVERRIDE_PRICE = 'OVERRIDE_PRICE',
  APPROVE_DOCUMENT="APPROVE_DOCUMENT",
  
}




// -------------------------
// Updated seller type
// -------------------------
export type UpdatedSellerResponse = {
  Id:string,
  username: string;
  agency: string;
  salePoint: string;

 
 Permissions: Permission[];


  permittedSaleSizes: SaleSize[];

  
   
   
    // Organization (The Company)
     organizationId:string;
    organizationName:string;
     organizationLogoUri:string;
    organizationEmail:string;
    taxNumber:string;

    // Agency (The Branch)
    agencyId:string;
    
   agencyEmail:string;
    agencyPhone:string;
    
    agencyCity:string;
     agencyAddress:string;

    // Sales Point (Specific Stall/Register)
    salesPointId:string;
    
     salesPointAddress:string;

     createdAt:string;
};








