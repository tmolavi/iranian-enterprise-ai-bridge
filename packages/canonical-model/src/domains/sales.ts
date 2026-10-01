import { BaseCanonicalEntity } from '../base/metadata.js';

export type InvoiceStatus = 'DRAFT' | 'CONFIRMED' | 'SENT_TO_TAX_AUTHORITY' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED';

export interface SalesOrder extends BaseCanonicalEntity {
  orderNumber: string;
  orderDateJalali: string;
  orderDateGregorian: string;
  customerId: string;
  salesRepresentativeId?: string;
  totalGrossAmountRial: number;
  totalDiscountAmountRial: number;
  totalTaxAmountRial: number;
  totalNetAmountRial: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'IN_PRODUCTION' | 'SHIPPED' | 'CLOSED' | 'CANCELLED';
  deliveryDueDateJalali?: string;
}

export interface Invoice extends BaseCanonicalEntity {
  invoiceNumber: string;
  taxSystemFiscalCode?: string; // شماره منحصر به فرد مالیاتی سامانه مودیان
  invoiceDateJalali: string;
  invoiceDateGregorian: string;
  customerId: string;
  salesOrderId?: string;
  salesRepresentativeId?: string;
  branchId?: string;
  costCenterId?: string;
  totalGrossAmountRial: number;
  totalDiscountAmountRial: number;
  totalVatAmountRial: number;
  totalTollAmountRial: number;
  totalNetAmountRial: number;
  paidAmountRial: number;
  remainingAmountRial: number;
  status: InvoiceStatus;
  paymentDueDateJalali?: string;
  paymentDueDateGregorian?: string;
  lines: InvoiceLine[];
}

export interface InvoiceLine {
  lineNumber: number;
  productId: string;
  warehouseId?: string;
  quantity: number;
  unitPriceRial: number;
  grossAmountRial: number;
  discountAmountRial: number;
  vatRate: number; // e.g. 0.10 for 10% VAT in Iran
  vatAmountRial: number;
  netAmountRial: number;
  cogsAmountRial?: number; // بهای تمام‌شده کالای فروش رفته برای محاسبه حاشیه سود ناخالص
}

export interface Return extends BaseCanonicalEntity {
  returnNumber: string;
  returnDateJalali: string;
  invoiceId?: string;
  customerId: string;
  totalNetAmountRial: number;
  reason: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}
