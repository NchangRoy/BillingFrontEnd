/**
 * Transforms a Quotation (Devis) into an Invoice (Facture)
 * @param devis The source quotation data
 * @returns A formatted invoice object
 */
import { UpdatedFactureResponse } from "../models/UpdatedFactureResponse";
import { UpdatedDevisResponse } from "../models/UpdatedDevisResponse";
import { FactureResponse } from "../models/FactureResponse";
import { LigneFactureResponse } from "../models/LigneFactureResponse";
export const mapDevisToFacture = (devis: UpdatedDevisResponse): UpdatedFactureResponse => {
  // Map Quotation Lines to Invoice Lines
  const lignesFacture: LigneFactureResponse[] = (devis.lignesDevis || []).map((ligne, index) => ({
    idLigne: `L-${devis.idDevis || 'NEW'}-${index}`, // Generating a temporary ID
    idProduit: ligne.idProduit,
    nomProduit: ligne.nomProduit,
    quantite: ligne.quantite,
    prixUnitaire: ligne.prixUnitaire,
    montantTotal: ligne.montantTotal,
    description: ligne.description,
    remisePourcentage: (ligne.remiseMontant && ligne.montantTotal) 
      ? (ligne.remiseMontant / (ligne.montantTotal + ligne.remiseMontant)) * 100 
      : 0,
    isTaxLine: ligne.isTaxLine,
  }));

  return {
    // Generate new Invoice ID or leave for backend
    idFacture: undefined, 
    numeroFacture: undefined, 
    
    // Dates
    dateFacturation: new Date().toISOString().split('T')[0], // Today's date
    dateSysteme: new Date().toISOString(),
    dateEcheance: devis.dateValidite, // Defaulting due date to quotation validity
    
    // Status & Type
    etat: FactureResponse.etat.BROUILLON, // New invoices usually start as Draft
    type: devis.type,
    
    // Client Info
    idClient: devis.idClient,
    nomClient: devis.nomClient,
    adresseClient: devis.adresseClient,
    emailClient: devis.emailClient,
    telephoneClient: devis.telephoneClient,
    referalClientId: devis.referalClientId,

    // Financials
    montantHT: devis.montantHT,
    montantTVA: devis.montantTVA,
    montantTTC: devis.montantTTC,
    montantTotal: devis.montantTotal,
    finalAmount: devis.finalAmount,
    montantRestant: devis.finalAmount, // Initially, the full amount is remaining
    remiseGlobalePourcentage: devis.remiseGlobalePourcentage,
    remiseGlobaleMontant: devis.remiseGlobaleMontant,
    applyVat: devis.applyVat,
    devise: devis.devise,
    tauxChange: devis.tauxChange,
    
    // Logistics
    modeReglement: devis.modeReglement as unknown as FactureResponse.modeReglement,
    conditionsPaiement: devis.conditionsPaiement,
    nbreEcheance: devis.nbreEcheance,
    nosRef: devis.nosRef,
    vosRef: devis.vosRef,
    idDevisOrigine: devis.idDevis,
    
    // Items
    lignesFacture: lignesFacture,
    
    // Metadata
    notes: devis.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};



import { UpdatedProformaInvoiceResponse } from '../models/UpdatedProformaInvoiceResponse';

/**
 * Transforms an UpdatedDevisResponse (Quotation) into an UpdatedProformaInvoiceResponse.
 * This is used when a client accepts a quote and you need to issue a Proforma.
 */
export const mapDevisToProforma = (devis: UpdatedDevisResponse): UpdatedProformaInvoiceResponse => {
  return {
    // Basic Identifiers
    idProformaInvoice: devis.idDevis, 
    numeroProformaInvoice: devis.numeroDevis,
    
    // Dates & System Info
    dateCreation: devis.dateCreation,
    dateSysteme: devis.dateSysteme || new Date().toISOString(),
    createdAt: devis.createdAt,
    updatedAt: new Date().toISOString(), // Marked as updated now
    
    // Business Logic Fields
    type: devis.type,
    // Map status specifically to the Proforma enum namespace
    statut: devis.statut as unknown as UpdatedProformaInvoiceResponse.statut,
    
    // Client Information
    idClient: devis.idClient,
    nomClient: devis.nomClient,
    adresseClient: devis.adresseClient,
    emailClient: devis.emailClient,
    telephoneClient: devis.telephoneClient,
    referalClientId: devis.referalClientId,

    // Financial Totals
    montantHT: devis.montantHT,
    montantTVA: devis.montantTVA,
    montantTTC: devis.montantTTC,
    montantTotal: devis.montantTotal,
    finalAmount: devis.finalAmount,
    
    // Line Items (Schemas are identical for LigneDevisResponse)
    lignesDevis: devis.lignesDevis ? [...devis.lignesDevis] : [],

    // Tax & Currency
    applyVat: devis.applyVat,
    devise: devis.devise,
    tauxChange: devis.tauxChange,
    
    // Payment & Reference Terms
    modeReglement: devis.modeReglement as unknown as UpdatedProformaInvoiceResponse.modeReglement,
    conditionsPaiement: devis.conditionsPaiement,
    nbreEcheance: devis.nbreEcheance,
    nosRef: devis.nosRef,
    vosRef: devis.vosRef,
    referenceExterne: devis.referenceExterne,
    
    // Discounts & Validity
    remiseGlobalePourcentage: devis.remiseGlobalePourcentage,
    remiseGlobaleMontant: devis.remiseGlobaleMontant,
    validiteOffreJours: devis.validiteOffreJours,
    
    // Documentation & Audit
    notes: devis.notes,
    pdfPath: devis.pdfPath,
    envoyeParEmail: devis.envoyeParEmail,
    dateEnvoiEmail: devis.dateEnvoiEmail,
    dateAcceptation: devis.dateAcceptation,
    dateRefus: devis.dateRefus,
    motifRefus: devis.motifRefus,
    idFactureConvertie: devis.idFactureConvertie,
  };
};