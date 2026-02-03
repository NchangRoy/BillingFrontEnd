import { 
    BondeReceptionCreateRequest,
    BondeReceptionResponse, 
    LineBonReception 
} from '../src2/api'; 
import { 
    GoodsReceiptNoteResponse, 
    GoodsReceiptLineResponse, 
    GoodReceiptResponse 
} from '../api/models/GoodsReceiptNote';

/**
 * HELPER: Formats a date string to a strict LocalDateTime format (ISO-8601 without offset)
 * Input:  "2026-01-24T10:30:00.000Z"
 * Output: "2026-01-24T10:30:00"
 */
const formatToLocalDateTime = (dateStr?: string): string | undefined => {
    if (!dateStr) return undefined;
    try {
        const date = new Date(dateStr);
        // Returns YYYY-MM-DDTHH:mm:ss.sssZ, then we slice off the 'Z'
        return date.toISOString().split('.')[0]; 
    } catch (e) {
        // Fallback: if the string isn't a date, try to strip 'Z' manually
        return dateStr.split('Z')[0].split('+')[0];
    }
};

/**
 * Maps the API Status (technical string) to the Internal Status (French label string)
 */
const mapStatus = (apiStatus?: string): GoodReceiptResponse.statut | undefined => {
    if (!apiStatus) return undefined;
    switch (apiStatus.toUpperCase()) {
        case 'DRAFT': return GoodReceiptResponse.statut.DRAFT;
        case 'PARTIALLY_RECEIVED': return GoodReceiptResponse.statut.PARTIALLY_RECEIVED;
        case 'RECEIVED': return GoodReceiptResponse.statut.RECEIVED;
        case 'REJECTED': return GoodReceiptResponse.statut.REJECTED;
        case 'ANNULE': return GoodReceiptResponse.statut.ANNULE;
        default: return GoodReceiptResponse.statut.DRAFT;
    }
};

const mapLineItem = (line: LineBonReception): GoodsReceiptLineResponse => ({
    productId: line.productId,
    description: line.description,
    uom: line.uom,
    orderedQuantity: line.orderedQuantity ?? 0,
    receivedQuantity: line.receivedQuantity ?? 0,
    acceptedQuantity: line.acceptedQuantity ?? 0,
    rejectedQuantity: line.rejectedQuantity ?? 0,
    shortQuantity: line.shortQuantity ?? 0,
    damagedQuantity: line.damagedQuantity ?? 0,
    excessQuantity: line.excessQuantity ?? 0,
    rate: line.rate ?? 0,
    lineAmount: line.lineAmount ?? 0,
});

/**
 * FROM API -> INTERNAL MODEL
 */
export const mapGRNResponseToInternal = (apiData: BondeReceptionResponse): GoodsReceiptNoteResponse => {
    return {
        idGRN: apiData.idGRN,
        grnNumber: apiData.grnNumber,
        supplierId: apiData.supplierId,
        supplierName: apiData.supplierName,
        transporterCompanyName: apiData.transporterCompanyName,
        vehicleNumber: apiData.vehicleNumber,
        purchaseOrderId: apiData.purchaseOrderId,
        purchaseOrderNumber: apiData.purchaseOrderNumber,
        // Keep as is for UI or format if you want consistent display
        receiptDate: apiData.receiptDate,
        documentDate: apiData.documentDate,
        systemDate: apiData.systemDate,
        status: mapStatus(apiData.status),
        lines: apiData.lines?.map(mapLineItem) || [],
        preparedBy: apiData.preparedBy,
        inspectedBy: apiData.inspectedBy,
        approvedBy: apiData.approvedBy,
        remarks: apiData.remarks,
        createdAt: apiData.createdAt,
        updatedAt: apiData.updatedAt,
    };
};

/**
 * FROM INTERNAL MODEL -> API CREATE REQUEST (With LocalDateTime adjustment)
 */
export const mapInternalToBondeReceptionCreateRequest = (data: GoodsReceiptNoteResponse): BondeReceptionCreateRequest => {
    return {
        grnNumber: data.grnNumber,
        supplierId: data.supplierId,
        supplierName: data.supplierName,
        transporterCompanyName: data.transporterCompanyName,
        vehicleNumber: data.vehicleNumber,
        purchaseOrderId: data.purchaseOrderId,
        purchaseOrderNumber: data.purchaseOrderNumber,
        // Convert to LocalDateTime for Backend
        receiptDate: formatToLocalDateTime(data.receiptDate),
        documentDate: formatToLocalDateTime(data.documentDate),
        systemDate: formatToLocalDateTime(data.systemDate),
        status: mapInternalStatusToApi(data.status),
        lines: data.lines?.map(mapInternalLineToApi) || [],
        preparedBy: data.preparedBy,
        inspectedBy: data.inspectedBy,
        approvedBy: data.approvedBy,
        remarks: data.remarks,
    };
};

const mapInternalStatusToApi = (internalStatus?: GoodReceiptResponse.statut): BondeReceptionCreateRequest.status | undefined => {
    if (!internalStatus) return undefined;
    switch (internalStatus) {
        case GoodReceiptResponse.statut.DRAFT: return BondeReceptionCreateRequest.status.DRAFT;
        case GoodReceiptResponse.statut.PARTIALLY_RECEIVED: return BondeReceptionCreateRequest.status.PARTIALLY_RECEIVED;
        case GoodReceiptResponse.statut.RECEIVED: return BondeReceptionCreateRequest.status.RECEIVED;
        case GoodReceiptResponse.statut.REJECTED: return BondeReceptionCreateRequest.status.REJECTED;
        case GoodReceiptResponse.statut.ANNULE: return BondeReceptionCreateRequest.status.ANNULE;
        default: return BondeReceptionCreateRequest.status.DRAFT;
    }
};

const mapInternalLineToApi = (line: GoodsReceiptLineResponse): LineBonReception => ({
    productId: line.productId,
    description: line.description,
    uom: line.uom,
    orderedQuantity: line.orderedQuantity,
    receivedQuantity: line.receivedQuantity,
    acceptedQuantity: line.acceptedQuantity,
    rejectedQuantity: line.rejectedQuantity,
    shortQuantity: line.shortQuantity,
    damagedQuantity: line.damagedQuantity,
    excessQuantity: line.excessQuantity,
    rate: line.rate,
    lineAmount: line.lineAmount,
});

export const mapBonReceptionArrayToGRNArray = (responses: BondeReceptionResponse[]): GoodsReceiptNoteResponse[] => {
    return responses.map(n => mapGRNResponseToInternal(n));
};

export const mapGRNArrayToInternalArray = (apiList: BondeReceptionResponse[] | undefined): GoodsReceiptNoteResponse[] => {
    if (!apiList) return [];
    return apiList.map(item => mapGRNResponseToInternal(item));
};