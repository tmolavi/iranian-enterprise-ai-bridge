import { BaseCanonicalEntity } from '../base/metadata.js';

export interface PurchaseRequest extends BaseCanonicalEntity {
  requestNumber: string;
  requestDateJalali: string;
  requestedByEmployeeId: string;
  departmentId?: string;
  costCenterId?: string;
  urgency: 'NORMAL' | 'URGENT' | 'CRITICAL';
  status: 'SUBMITTED' | 'APPROVED' | 'IN_PROCUREMENT' | 'REJECTED';
}

export interface PurchaseOrder extends BaseCanonicalEntity {
  orderNumber: string;
  orderDateJalali: string;
  supplierId: string;
  totalGrossAmountRial: number;
  totalDiscountAmountRial: number;
  totalVatAmountRial: number;
  totalNetAmountRial: number;
  paymentTermDays?: number;
  expectedDeliveryDateJalali?: string;
  status: 'DRAFT' | 'ISSUED' | 'PARTIALLY_RECEIVED' | 'FULFILLED' | 'CANCELLED';
}

export interface GoodsReceipt extends BaseCanonicalEntity {
  receiptNumber: string;
  receiptDateJalali: string;
  receiptDateGregorian: string;
  purchaseOrderId?: string;
  supplierId: string;
  warehouseId: string;
  totalAmountRial: number;
  status: 'PENDING_INSPECTION' | 'ACCEPTED' | 'REJECTED' | 'STORED';
}
