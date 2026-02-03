import { 
    UpdatedSupplierFactureResponse, 
    LigneSupplierFactureResponse, 
    FactureResponse 

} from '../api/models/UpdatedSupplierFactureResponse';
import { 
    FactureFournisseurCreateRequest, 
    LineFactureFournisseur,
    FactureFournisseurResponse 
} from '../src2/api';

/**
 * HELPER: Strips timezone to match Java LocalDateTime expectation
 */
const toLocalDateTime = (dateStr?: string): string | undefined => {
    if (!dateStr) return undefined;
    return dateStr.split('Z')[0].split('+')[0];
};

/**
 * Maps Internal Line to Request Line
 */
const mapInternalLineToRequest = (line: LigneSupplierFactureResponse): LineFactureFournisseur => ({
    quantite: line.quantite ?? 0,
    description: line.description,
    debit: line.debit ?? 0,
    credit: line.credit ?? 0,
    isTaxLine: line.isTaxLine,
    idProduit: line.idProduit,
    nomProduit: line.nomProduit,
    prixUnitaire: line.prixUnitaire,
    montantTotal: line.montantTotal,
});

/**
 * Main Mapper: Internal Supplier Invoice -> API Create Request
 */
export const mapInternalToFactureFournisseurCreateRequest = (
    data: UpdatedSupplierFactureResponse,
    creatorName?: string
): FactureFournisseurCreateRequest => {
    return {
        numeroFacture: data.numeroFacture,
        dateFacturation: toLocalDateTime(data.dateFacturation),
        dateEcheance: toLocalDateTime(data.dateEcheance),
        
        // Enums mapping (keys match in your case, so we cast to the target enum)
        etat: data.etat as unknown as FactureFournisseurCreateRequest.etat,
        modeReglement: data.modeReglement as unknown as FactureFournisseurCreateRequest.modeReglement,
        
        type: data.type,
        idFournisseur: data.idFournisseur,
        nomFournisseru: data.nomFournisseru,
        adresseFournisseur: data.adresseFournisseur,
        emailFournisseur: data.emailFournisseur,
        telephoneFournisseur: data.telephoneFournisseur,
        
        montantHT: data.montantHT,
        montantTVA: data.montantTVA,
        montantTTC: data.montantTTC,
        
        remiseGlobalePourcentage: data.remiseGlobalePourcentage,
        applyVat: data.applyVat,
        devise: data.devise,
        tauxChange: data.tauxChange,
        
        referenceCommande: data.referenceCommande,
        idGRN: data.idGRN,
        numeroGRN: data.numeroGRN,
        
        lignesFacture: data.lignesFacture?.map(mapInternalLineToRequest) || [],
        notes: data.notes,
        
        // Custom field for the creator
        createdBy: data.createdBy
    };
};





/**
 * Maps a single Line item from Backend to Internal UI format
 */
const mapLineBackendToInternal = (
    line: any // Typically LineFactureFournisseur
): LigneSupplierFactureResponse => ({
    idLigne: line.idLigne,
    quantite: line.quantite,
    description: line.description,
    debit: line.debit ?? 0,
    credit: line.credit ?? 0,
    isTaxLine: line.isTaxLine,
    idProduit: line.idProduit,
    nomProduit: line.nomProduit,
    prixUnitaire: line.prixUnitaire,
    montantTotal: line.montantTotal,
    remisePourcentage: line.remisePourcentage ?? 0,
    remiseMontant: line.remiseMontant ?? 0,
});

/**
 * Main Mapper: FactureFournisseurResponse -> UpdatedSupplierFactureResponse
 */
export const mapBackendFactureFournisseurToInternal = (
    api: FactureFournisseurResponse
): UpdatedSupplierFactureResponse => {
    return {
        idFacture: api.idFacture,
        numeroFacture: api.numeroFacture,
        dateFacturation: api.dateFacturation,
        dateEcheance: api.dateEcheance,
        dateSysteme: api.dateSysteme,
        
        // Enum Casting (assuming keys match)
        etat: api.etat as unknown as FactureResponse.etat,
        modeReglement: api.modeReglement as unknown as FactureResponse.modeReglement,
        
        type: api.type,
        idFournisseur: api.idFournisseur,
        nomFournisseru: api.nomFournisseru,
        adresseFournisseur: api.adresseFournisseur,
        emailFournisseur: api.emailFournisseur,
        telephoneFournisseur: api.telephoneFournisseur,
        
        montantHT: api.montantHT,
        montantTVA: api.montantTVA,
        montantTTC: api.montantTTC,
        montantTotal: api.montantTotal,
        montantRestant: api.montantRestant,
        finalAmount: api.finalAmount,
        
        remiseGlobalePourcentage: api.remiseGlobalePourcentage,
        remiseGlobaleMontant: api.remiseGlobaleMontant,
        applyVat: api.applyVat,
        devise: api.devise,
        tauxChange: api.tauxChange,
        conditionsPaiement: api.conditionsPaiement,
        nbreEcheance: api.nbreEcheance,
        
        nosRef: api.nosRef,
        vosRef: api.vosRef,
        referenceCommande: api.referenceCommande,
        idGRN: api.idGRN,
        numeroGRN: api.numeroGRN,
        
        lignesFacture: api.lignesFacture?.map(mapLineBackendToInternal) || [],
        notes: api.notes,
        
        createdAt: api.createdAt,
        updatedAt: api.updatedAt,
    };
};

/**
 * Array Mapper for handling lists
 */
export const mapBackendFactureFournisseurArrayToInternal = (
    responses: FactureFournisseurResponse[] | undefined
): UpdatedSupplierFactureResponse[] => {
    if (!responses) return [];
    return responses.map(mapBackendFactureFournisseurToInternal);
};


