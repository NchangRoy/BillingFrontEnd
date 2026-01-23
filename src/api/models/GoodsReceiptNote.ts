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

  status?: GoodReceiptResponse.statut;

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
  
  lineAmount?: number;

 
};


export namespace GoodReceiptResponse{
   export enum statut {
        BROUILLON = 'BROUILLON',
        VALIDE = 'VALIDE',           // Confirmed by client
        EN_COURS = 'EN_COURS',       // In preparation
        EXPEDIE = 'EXPEDIE',         // Left the warehouse
        LIVRE = 'LIVRE',             // Final delivery confirmed
        ANNULE = 'ANNULE'
    }
}



export const MOCK_GOODS_RN: GoodsReceiptNoteResponse[] = [
  {
    idGRN: "grn-8821-2026",
    grnNumber: "GRN/2026/001",
    supplierId: "sup-445",
    supplierName: "Agro-Industries Cameroon",
    transporterCompanyName: "Rapid Logistics Ltd",
    vehicleNumber: "LT-552-CA",
    purchaseOrderId: "po-992",
    purchaseOrderNumber: "PO-2026-778",
    receiptDate: "2026-01-22T10:30:00Z",
    documentDate: "2026-01-23T08:15:00Z",
    systemDate: "2026-01-23T08:15:00Z",
    status: GoodReceiptResponse.statut.LIVRE,
    preparedBy: "John Doe",
    inspectedBy: "Sarah Connor",
    approvedBy: "Robert Smith",
    remarks: "Batch inspected and 5 items rejected due to packaging damage.",
    lines: [
      {
        productId: "prod-101",
        description: "Premium Grade Cocoa Beans",
        uom: "Kilogram",
        orderedQuantity: 500,
        receivedQuantity: 500,
        acceptedQuantity: 495,
        rejectedQuantity: 5,
        shortQuantity: 0,
        damagedQuantity: 5,
        excessQuantity: 0,
        rate: 1200,
        lineAmount: 600000
      },
      {
        productId: "prod-202",
        description: "Refined Palm Oil",
        uom: "Litre",
        orderedQuantity: 200,
        receivedQuantity: 205,
        acceptedQuantity: 205,
        rejectedQuantity: 0,
        shortQuantity: 0,
        damagedQuantity: 0,
        excessQuantity: 5,
        rate: 950,
        lineAmount: 194750
      }
    ],
    createdAt: "2026-01-23T08:15:00Z",
    updatedAt: "2026-01-23T14:20:00Z"
  },
  {
    idGRN: "grn-8822-2026",
    grnNumber: "GRN/2026/002",
    supplierId: "sup-771",
    supplierName: "Global Seed Co.",
    transporterCompanyName: "Internal Fleet",
    vehicleNumber: "CE-001-HQ",
    purchaseOrderId: "po-995",
    purchaseOrderNumber: "PO-2026-812",
    receiptDate: "2026-01-23T14:00:00Z",
    documentDate: "2026-01-23T15:00:00Z",
    systemDate: "2026-01-23T15:16:00Z",
    status: GoodReceiptResponse.statut.BROUILLON,
    preparedBy: "Alice Mballa",
    inspectedBy: undefined, // Changed from null to undefined to match optional types
    approvedBy: undefined,
    remarks: "Pending quality control signature.",
    lines: [
      {
        productId: "prod-505",
        description: "Fertilizer NPK 15-15-15",
        uom: "Bag (50kg)",
        orderedQuantity: 50,
        receivedQuantity: 48,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        shortQuantity: 2,
        damagedQuantity: 0,
        excessQuantity: 0,
        rate: 25000,
        lineAmount: 1200000
      }
    ],
    createdAt: "2026-01-23T15:16:00Z",
    updatedAt: "2026-01-23T15:16:00Z"
  },
  {
    idGRN: "grn-8823-2026",
    grnNumber: "GRN/2026/003",
    supplierId: "sup-900",
    supplierName: "Industrial Tools SA",
    transporterCompanyName: "Cameroon Rail",
    vehicleNumber: "WAGON-77",
    purchaseOrderId: "po-1001",
    purchaseOrderNumber: "PO-2026-905",
    receiptDate: "2026-01-23T11:00:00Z",
    documentDate: "2026-01-23T12:00:00Z",
    systemDate: "2026-01-23T12:00:00Z",
    status: GoodReceiptResponse.statut.VALIDE,
    preparedBy: "Emma Watson",
    inspectedBy: "Kevin Hart",
    approvedBy: "Dwayne Johnson",
    remarks: "Full shipment received and validated.",
    lines: [
      {
        productId: "prod-99",
        description: "Protective Gloves",
        uom: "Pair",
        orderedQuantity: 100,
        receivedQuantity: 100,
        acceptedQuantity: 100,
        rejectedQuantity: 0,
        shortQuantity: 0,
        damagedQuantity: 0,
        excessQuantity: 0,
        rate: 500,
        lineAmount: 50000
      }
    ],
    createdAt: "2026-01-23T12:00:00Z",
    updatedAt: "2026-01-23T13:00:00Z"
  }
];