import { UpdatedSalesOrderResponse } from '../models/UpdatedSalesOrder';
import { DeliveryNoteLineResponse, DeliveryNoteResponse } from '../models/DeliveryNoteResponse';
import { UpdatedFactureResponse, FactureResponse } from '../models/UpdatedFactureResponse';
import { LigneFactureResponse } from '../models/LigneFactureResponse';

/**
 * Transforms a Sales Order into a Delivery Note.
 * Maps Sales Order client and recipient data to the new DeliveryNote structure.
 */
export const transformSalesOrderToDeliveryNote = (
  so: UpdatedSalesOrderResponse
): DeliveryNoteResponse => {
  return {
    // Unique ID for the new document
   
    
    // Status defaults to BROUILLON
    etat: DeliveryNoteResponse.etat.BROUILLON,

    // 1. Client Info Mapping (The payer/billing entity)
    idClient: so.idClient,
    nomClient: so.nomClient,
    adresseClient: so.adresseClient,
    emailClient: so.emailClient,
    telephoneClient: so.telephoneClient,

    // 2. Recipient Info Mapping (The logistics/delivery target)
    // Falls back to client info if specific recipient fields are empty
    recipientName: so.recipientName || so.nomClient,
    recipientPhone: so.recipientPhone || so.telephoneClient,
    recipientAddress: so.recipientAddress || so.adresseClient,
    recipientCity: so.recipientCity || "",

    // 3. Delivery Metadata
    deliveryDate: so.deliveryDate || so.expectedDeliveryDate || new Date().toISOString(),
    dueDate: so.expectedDeliveryDate,

    // 4. Line Items Mapping
    lines: so.lignesSalesOrder?.map((ligne): DeliveryNoteLineResponse => ({
      productId: ligne.idProduit,
      description: ligne.description || ligne.nomProduit,
      quantity: ligne.quantite,
      unitPrice: ligne.prixUnitaire,
      amount: ligne.montantTotal
    })) || [],

    // 5. Financials & References
    totalAmount: so.montantTTC,
    idSaleOrder: so.idSalesOrder,
    SaleOrderNumber: so.numeroSalesOrder,

    // 6. Metadata
    termsAndConditions: so.notes || "Goods must be checked upon arrival. Claims made after delivery may not be accepted.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Transforms a Delivery Note into a Client Invoice (Facture).
 * Use case: billing the client once goods have actually shipped.
 */
export const mapDeliveryNoteToFacture = (note: DeliveryNoteResponse): UpdatedFactureResponse => {
  const now = new Date().toISOString();

  const lignesFacture: LigneFactureResponse[] = (note.lines || []).map((ligne) => ({
    idProduit: ligne.idProduit || ligne.productId,
    nomProduit: ligne.description,
    description: ligne.description,
    quantite: ligne.quantity,
    prixUnitaire: ligne.unitPrice,
    montantTotal: ligne.amount,
    remisePourcentage: 0,
    isTaxLine: false,
  }));

  return {
    dateFacturation: now.split('T')[0],
    dateSysteme: now,
    etat: FactureResponse.etat.BROUILLON,
    type: "VENTE",

    idClient: note.idClient,
    nomClient: note.nomClient,
    adresseClient: note.adresseClient,
    emailClient: note.emailClient,
    telephoneClient: note.telephoneClient,

    montantHT: note.totalAmount,
    montantTVA: 0,
    montantTTC: note.totalAmount,
    montantTotal: note.totalAmount,
    montantRestant: note.totalAmount,
    finalAmount: note.totalAmount,

    applyVat: false,
    devise: "XAF",
    tauxChange: 1,

    referenceCommande: note.SaleOrderNumber,
    notes: `Facture générée à partir du bon de livraison ${note.deliveryNoteNumber ?? note.idDN ?? ''}.`,

    lignesFacture,
    createdAt: now,
    updatedAt: now,
  };
};