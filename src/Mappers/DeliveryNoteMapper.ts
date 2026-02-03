import { DeliveryNoteResponse, DeliveryNoteLineResponse } from '../api/models/DeliveryNoteResponse';
import { 
    BonLivraisonRequest, 
    BonLivraisonResponse, 
    LigneBonLivraisonRequest 
} from '../src2/api';

/**
 * API -> UI: Transforms a list of backend responses to UI models
 */
export const mapBackendArrayToDeliveryNoteList = (
    backendList: BonLivraisonResponse[]
): DeliveryNoteResponse[] => {
    if (!backendList) return [];
    return backendList.map(item => mapBackendResponseToUI(item));
};

/**
 * API -> UI: Maps a single Backend Response to the UI Model
 */
export const mapBackendResponseToUI = (apiRes: BonLivraisonResponse): DeliveryNoteResponse => {
    return {
        idDN: apiRes.idBonLivraison,
        deliveryNoteNumber: apiRes.numeroBonLivraison,

        // Client Info
        idClient: apiRes.idClient,
        nomClient: apiRes.nomClient,
        
        // Recipient Info (Mapped from backend naming)
        recipientName: apiRes.nomDestinataire,
        recipientAddress: apiRes.adresseDestinataire,
        recipientPhone: apiRes.contactDestinataire,

        deliveryAgency: apiRes.nomAgence,

        // Dates
        deliveryDate: apiRes.dateLivraison,
        dueDate: apiRes.dateEcheance,

        // Status
        etat: mapBackendStatusToUI(apiRes.statut),
  
        // Line Items (using 'lines' and 'totalAmount' as per your OpenAPI)
        lines: apiRes.lines?.map(l => ({
            productId: l.productId,
            idProduit: l.productId,
            description: l.description,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            amount: l.amount
        })),

        totalAmount: apiRes.totalAmount,
        termsAndConditions: apiRes.termsAndConditions,
        
        // Reference (Mapped to purchaseOrderNumber in your response)
        SaleOrderNumber: apiRes.purchaseOrderNumber,

        createdAt: apiRes.createdAt,
        updatedAt: apiRes.updatedAt
    };
};

/**
 * UI -> API: Transforms UI state to Backend Request
 */
export const mapDeliveryNoteToRequest = (
    dn: DeliveryNoteResponse
): BonLivraisonRequest => {
    return {
        numeroBonLivraison: dn.deliveryNoteNumber,
        idClient: dn.idClient ?? '',
        nomClient: dn.nomClient,
        nomDestinataire: dn.recipientName,
        adresseDestinataire: dn.recipientAddress,
        contactDestinataire: dn.recipientPhone,
        nomAgence: dn.deliveryAgency,

        // LocalDateTime Formatting (Stripping 'Z' for backend)
        dateLivraison: dn.deliveryDate 
            ? new Date(dn.deliveryDate).toISOString().split('.')[0] 
            : new Date().toISOString().split('.')[0],
            
        dateEcheance: dn.dueDate 
            ? new Date(dn.dueDate).toISOString().split('T')[0] 
            : undefined,

        statut: mapUIStatusToBackend(dn.etat),
        // Note: Check if request expects 'lines' or 'lignes' based on your specific Request type
        lignes: (dn.lines ?? []).map(line => ({
            idProduit: line.idProduit || line.productId || '',
            description: line.description,
            quantite: line.quantity ?? 0,
            prixUnitaire: line.unitPrice,
            montant: line.amount,
        })),

        montantTotal: dn.totalAmount,
        conditionsGenerales: dn.termsAndConditions,
    };
};

/**
 * Enum Mapping Helpers
 */
const mapUIStatusToBackend = (status: DeliveryNoteResponse.etat): BonLivraisonRequest.statut => {
    switch (status) {
        case DeliveryNoteResponse.etat.BROUILLON: return BonLivraisonRequest.statut.EN_PREPARATION;
        case DeliveryNoteResponse.etat.ENVOYE: return BonLivraisonRequest.statut.EXPEDIE;
        case DeliveryNoteResponse.etat.ANNULE: return BonLivraisonRequest.statut.ANNULE;
        default: return BonLivraisonRequest.statut.EN_PREPARATION;
    }
};

const mapBackendStatusToUI = (status?: BonLivraisonResponse.statut): DeliveryNoteResponse.etat => {
    if (status === BonLivraisonResponse.statut.EXPEDIE || status === BonLivraisonResponse.statut.LIVRE) {
        return DeliveryNoteResponse.etat.ENVOYE;
    }
    if (status === BonLivraisonResponse.statut.ANNULE) {
        return DeliveryNoteResponse.etat.ANNULE;
    }
    return DeliveryNoteResponse.etat.BROUILLON;
};