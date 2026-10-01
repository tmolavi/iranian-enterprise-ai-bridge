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
    taxSystemFiscalCode?: string;
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
    vatRate: number;
    vatAmountRial: number;
    netAmountRial: number;
    cogsAmountRial?: number;
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
//# sourceMappingURL=sales.d.ts.map