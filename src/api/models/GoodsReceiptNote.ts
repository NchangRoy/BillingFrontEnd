export type GoodsReceiptNoteResponse = {
  idGRN?: string;
  grnNumber?: string;

  supplierId?: string;
  supplierName?: string;



  transporterCompanyName?: string;
  vehicleNumber?: string;

  purchaseOrderId?: string;
  purchaseOrderNumber?: string;

   receiptDate?: string;        // Actual date goods received
  documentDate?: string;       // GRN creation date

  systemDate?: string;

  status?: 'DRAFT' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'REJECTED';

  lines?: GoodsReceiptLineResponse[];

  preparedBy?: string;
  inspectedBy?: string;
  approvedBy?: string;

  remarks?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type GoodsReceiptLineResponse = {
  productId?: string;
  description?: string;
  uom?: string;//unit of measure e.g Litre..

  orderedQuantity?: number;
  receivedQuantity?: number;
  acceptedQuantity?: number;
  rejectedQuantity?: number;
  shortQuantity?: number;
  damagedQuantity?: number;
  excessQuantity?: number;

  rate?: number;
  discount?: number;
  lineAmount?: number;

 
};
