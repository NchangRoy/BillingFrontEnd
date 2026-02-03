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
};






export const seller1: UpdatedSellerResponse = {
  Id: "76811d3f-d192-4d89-98eb-51c0068f7756",
  username: 'alice_smith',
  agency: 'North Depot',
  salePoint: 'Depot-1',
  Permissions: [Permission.APPLY_DISCOUNT, Permission.NEGOTIATE_PRICE],
  permittedSaleSizes: [SaleSize.DETAIL, SaleSize.DEMIS_GROS],
};

export const seller2: UpdatedSellerResponse = {
  Id: "d5e8f4a2-9b3c-4e1a-8f6d-7c2a1b0e9f4a",
  username: 'bob_johnson',
  agency: 'Central Depot',
  salePoint: 'Depot-3',
  Permissions: [Permission.APPLY_DISCOUNT],
  permittedSaleSizes: [SaleSize.GROS, SaleSize.SUPER_GROS],
};
