export enum StatutDevis {
  BROUILLON = "BROUILLON",
  VALIDE = "VALIDE",
  REJETE = "REJETE",
  EXPIRE = "EXPIRE",
}

export enum TypePaiementDevis {
  COMPTANT = "COMPTANT",
  VIREMENT = "VIREMENT",
  CHEQUE = "CHEQUE",
}

export interface LigneDevisResponse {
  idProduit?: string; // UUID string
  nomProduit?: string;
  quantite?: number;
  prixUnitaire?: number;
  montantTotal?: number;
}

export interface EnrichedDevisResponse {
  idDevis?: string; // UUID string
  numeroDevis: string;
  
  // Dates are strings in ISO 8601 format (e.g., "2026-02-04T17:00:00")
  dateCreation: string;
  dateValidite: string;
  
  type?: string;
  statut: StatutDevis;
  montantTotal?: number;
  
  idClient: string;
  nomClient?: string;
  adresseClient?: string;
  emailClient?: string;
  telephoneClient?: string;

  lignesDevis: LigneDevisResponse[];

  montantHT?: number;
  montantTVA?: number;
  montantTTC?: number;
  devise?: string;
  tauxChange: number;
  conditionsPaiement?: string;
  notes?: string;
  referenceExterne?: string;
  pdfPath?: string;
  envoyeParEmail: boolean;
  dateEnvoiEmail?: string;
  dateAcceptation?: string;
  dateRefus?: string;
  motifRefus?: string;
  idFactureConvertie?: string; // UUID string
  remiseGlobalePourcentage: number;
  remiseGlobaleMontant: number;
  validiteOffreJours: number;
  
  applyVat: boolean;
  dateSysteme?: string;
  modeReglement?: TypePaiementDevis;
  nosRef?: string;
  vosRef?: string;
  nbreEcheance?: number;
  referalClientId?: string;
  finalAmount?: number;

  // Audit and Enrichment fields
  createdAt?: string;
  updatedAt?: string;
  organizationId?: string; // UUID string
  organizationName?: string;
  agencyId?: string; // UUID string
  agencyName?: string;
  salesPointId?: string; // UUID string
  salesPointName?: string; // Kept as string per your requirement
}