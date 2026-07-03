import { BackOrderRequest, BackOrderResponse, LigneBackOrder } from '../src2/api';
import { UpdatedBackOrderResponse, BackOrderLine, BackOrderStatus } from '../api/models/UpdatedBackOrderResponse';

export const mapBackOrderResponseToUI = (res: BackOrderResponse): UpdatedBackOrderResponse => ({
    id: res.idBackOrder,
    idBonAchat: res.idBonAchat,
    numeroBonAchat: res.numeroBonAchat,
    supplierName: res.nomFournisseur,
    statut: res.statut as unknown as BackOrderStatus.statut,
    lignes: res.lignes?.map(mapLigneToUI) ?? [],
    remarques: res.notes,
    createdAt: res.createdAt,
    updatedAt: res.updatedAt,
    organizationId: res.organizationId,
    agencyId: res.agencyId,
});

export const mapBackOrderArrayToUI = (list: BackOrderResponse[]): UpdatedBackOrderResponse[] =>
    list.map(mapBackOrderResponseToUI);

export const mapUIToBackOrderRequest = (ui: UpdatedBackOrderResponse): BackOrderRequest => ({
    idBonAchat: ui.idBonAchat ?? '',
    numeroBonAchat: ui.numeroBonAchat,
    nomFournisseur: ui.supplierName,
    statut: ui.statut as unknown as BackOrderRequest.statut,
    lignes: ui.lignes?.map(mapLineToRequest) ?? [],
    notes: ui.remarques,
    organizationId: ui.organizationId,
    agencyId: ui.agencyId,
});

const mapLigneToUI = (l: LigneBackOrder): BackOrderLine => ({
    id: l.idProduit,
    productId: l.idProduit,
    productName: l.nomProduit,
    quantiteCommandee: l.quantiteCommandee,
    quantiteRecue: l.quantiteRecue,
    quantiteManquante: l.quantiteEnAttente,
    unitPrice: l.prixUnitaire,
});

const mapLineToRequest = (l: BackOrderLine): LigneBackOrder => ({
    idProduit: l.productId,
    nomProduit: l.productName,
    quantiteCommandee: l.quantiteCommandee,
    quantiteRecue: l.quantiteRecue,
    quantiteEnAttente: l.quantiteManquante,
    prixUnitaire: l.unitPrice,
});
