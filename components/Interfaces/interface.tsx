export interface QuotationLine {
  idLigne?: number;
  quantite?: number;
  description?: string;
  debit?: number;
  credit?: number;
  isTaxLine?: boolean;
  idProduit?: number;
  nomProduit?: string;
  prixUnitaire?: number;
  montantTotal?: number;
  remisePourcentage?: number;
  remiseMontant?: number;
}
