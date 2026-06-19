import { BackOrderRequest, BackOrderResponse, LigneBackOrder } from '../src2/api';
import { UpdatedBackOrderResponse, BackOrderLine, BackOrderStatus } from '../api/models/UpdatedBackOrderResponse';

export const mapBackOrderResponseToUI = (res: BackOrderResponse): UpdatedBackOrderResponse => ({
    id: res.id,
    idBonAchat: res.idBonAchat,
    statut: res.statut as unknown as BackOrderStatus.statut,
    lignes: res.lignes?.map(mapLigneToUI) ?? [],
    remarques: res.remarques,
    createdAt: res.createdAt,
    updatedAt: res.updatedAt,
    organizationId: res.organizationId,
    agencyId: res.agencyId,
});

export const mapBackOrderArrayToUI = (list: BackOrderResponse[]): UpdatedBackOrderResponse[] =>
    list.map(mapBackOrderResponseToUI);

export const mapUIToBackOrderRequest = (ui: UpdatedBackOrderResponse): BackOrderRequest => ({
    idBonAchat: ui.idBonAchat,
    statut: ui.statut as unknown as BackOrderRequest.statut,
    lignes: ui.lignes?.map(mapLineToRequest) ?? [],
    remarques: ui.remarques,
    organizationId: ui.organizationId,
    agencyId: ui.agencyId,
});

const mapLigneToUI = (l: LigneBackOrder): BackOrderLine => ({
    id: l.id,
    productId: l.productId,
    productName: l.productName,
    quantiteCommandee: l.quantiteCommandee,
    quantiteRecue: l.quantiteRecue,
    quantiteManquante: l.quantiteManquante,
    unitPrice: l.unitPrice,
});

const mapLineToRequest = (l: BackOrderLine): LigneBackOrder => ({
    id: l.id,
    productId: l.productId,
    productName: l.productName,
    quantiteCommandee: l.quantiteCommandee,
    quantiteRecue: l.quantiteRecue,
    quantiteManquante: l.quantiteManquante,
    unitPrice: l.unitPrice,
});
