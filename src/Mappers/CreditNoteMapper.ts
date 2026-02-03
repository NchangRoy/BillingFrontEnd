import { UpdatedCreditNoteResponse, CreditNoteResponse } from '../api/models/UpdatedCreditNoteResponse';
import { NoteCreditRequest, NoteCreditResponse, LigneNoteCredit } from '../src2/api';
import { LigneFactureResponse } from '../api';

/**
 * Utility to ensure date strings are valid ISO datetime strings
 */
const ensureIsoString = (date?: string | Date): string | undefined => {
    if (!date) return undefined;
    const d = new Date(date);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
};

/**
 * Maps Internal Model -> API Request
 */
export const mapCreditNoteToRequest = (
    cn: UpdatedCreditNoteResponse
): NoteCreditRequest => {
    return {
        numeroNoteCredit: cn.numeroCreditNote,
        numeroFacture: cn.numeroFactureOrigine,
        
        // Enforced Datetime
        dateFacturation: ensureIsoString(cn.dateEmission),
        dateSysteme: ensureIsoString(cn.dateSysteme),
        
        idClient: cn.idClient,
        nomClient: cn.nomClient,
        adresseClient: cn.adresseClient,
        emailClient: cn.emailClient,
        telephoneClient: cn.telephoneClient,
        
        montantHT: cn.montantHT,
        montantTVA: cn.montantTVA,
        montantTTC: cn.montantTTC,
        montantTotal: cn.montantTTC, 
        finalAmount: cn.finalAmount,
        applyVat: cn.applyVat,
        devise: cn.devise,
        
        etat: cn.etat as unknown as NoteCreditRequest.etat,
        modeReglement: mapPaymentMode(cn.modeReglement),
        
        lignesFacture: (cn.lignesCreditNote ?? []).map(mapLigneToNoteCredit),
        
        notes: cn.notes,
        pdfPath: cn.pdfPath,
        type: cn.reason, 
    };
};

/**
 * Maps API Response -> Internal Model
 */
export const mapCNResponseToInternalCreditNote = (
    res: NoteCreditResponse
): UpdatedCreditNoteResponse => {
    return {
        idCreditNote: res.idCNoteCredit,
        numeroCreditNote: res.numeroNoteCredit,
        idFactureOrigine: undefined, 
        numeroFactureOrigine: res.numeroFacture,
        
        // Enforced Datetime
        dateEmission: ensureIsoString(res.dateFacturation),
        dateSysteme: ensureIsoString(res.dateSysteme),
        createdAt: ensureIsoString(res.createdAt),
        updatedAt: ensureIsoString(res.updatedAt),
        
        etat: res.etat as unknown as CreditNoteResponse.etat,
        reason: res.type as unknown as CreditNoteResponse.reason,
        
        idClient: res.idClient,
        nomClient: res.nomClient,
        adresseClient: res.adresseClient,
        emailClient: res.emailClient,
        telephoneClient: res.telephoneClient,
        
        montantHT: res.montantHT,
        montantTVA: res.montantTVA,
        montantTTC: res.montantTTC,
        applyVat: res.applyVat,
        finalAmount: res.finalAmount,
        devise: res.devise,
        
        modeReglement: mapResponsePaymentMode(res.modeReglement),
        lignesCreditNote: res.lignesFacture || [],
        
        notes: res.notes,
        pdfPath: res.pdfPath,
    };
};

/**
 * HELPERS
 */

const mapLigneToNoteCredit = (ligne: LigneFactureResponse): LigneNoteCredit => ({
    idProduit: ligne.idProduit,
    nomProduit: ligne.nomProduit,
    quantite: ligne.quantite,
    prixUnitaire: ligne.prixUnitaire,
    montantTotal: ligne.montantTotal,
    description: ligne.description,
    debit: ligne.debit,
    credit: ligne.credit,
    isTaxLine: ligne.isTaxLine,
});

const mapPaymentMode = (mode?: CreditNoteResponse.modeReglement): NoteCreditRequest.modeReglement => {
    if (!mode) return NoteCreditRequest.modeReglement.AUTRE;
    if (mode === CreditNoteResponse.modeReglement.CREDIT_CLIENT) return NoteCreditRequest.modeReglement.BON_D_ACHAT;
    return mode as unknown as NoteCreditRequest.modeReglement;
};

const mapResponsePaymentMode = (mode?: NoteCreditResponse.modeReglement): CreditNoteResponse.modeReglement => {
    if (!mode) return CreditNoteResponse.modeReglement.AUTRE;
    if (mode === NoteCreditResponse.modeReglement.BON_D_ACHAT) return CreditNoteResponse.modeReglement.CREDIT_CLIENT;
    return mode as unknown as CreditNoteResponse.modeReglement;
};

export const mapCreditNoteArrayToInternalArray = (responses: NoteCreditResponse[]): UpdatedCreditNoteResponse[] => {
    return responses.map(res => mapCNResponseToInternalCreditNote(res));
};