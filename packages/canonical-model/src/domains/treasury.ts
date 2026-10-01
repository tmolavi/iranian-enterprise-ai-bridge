import { BaseCanonicalEntity } from '../base/metadata.js';

export type PaymentMethod = 'BANK_TRANSFER' | 'CHEQUE' | 'PROMISSORY_NOTE' | 'CASH' | 'POS' | 'CLEARING';
export type ChequeStatus = 'IN_PORTFOLIO' | 'DEPOSITED' | 'CLEARED' | 'BOUNCED' | 'RETURNED' | 'REVOKED';

export interface BankAccount extends BaseCanonicalEntity {
  bankNameFa: string; // ملی، صادرات، ملت، تجارت، پاسارگاد، سامان
  branchNameFa?: string;
  accountNumber: string;
  iban: string; // شماره شبا
  currency: 'RIAL' | 'TOMAN' | 'USD' | 'EUR';
  currentBalanceRial: number;
  lastReconciliationDateJalali?: string;
  isActive: boolean;
}

export interface CashAccount extends BaseCanonicalEntity {
  titleFa: string; // صندوق مرکزی، تنخواه کارخانه
  custodianEmployeeId: string;
  currentBalanceRial: number;
  isActive: boolean;
}

export interface Payment extends BaseCanonicalEntity {
  paymentNumber: string;
  paymentDateJalali: string;
  paymentDateGregorian: string;
  beneficiaryType: 'SUPPLIER' | 'EMPLOYEE' | 'TAX_ORGANIZATION' | 'INSURANCE' | 'OTHER';
  beneficiaryId?: string;
  beneficiaryNameFa: string;
  method: PaymentMethod;
  amountRial: number;
  bankAccountId?: string;
  chequeNumber?: string;
  chequeDueDateJalali?: string;
  chequeStatus?: ChequeStatus;
  journalEntryId?: string;
  status: 'DRAFT' | 'APPROVED' | 'PAID' | 'CANCELLED';
}

export interface Receipt extends BaseCanonicalEntity {
  receiptNumber: string;
  receiptDateJalali: string;
  receiptDateGregorian: string;
  payerType: 'CUSTOMER' | 'PARTNER' | 'OTHER';
  payerId?: string;
  payerNameFa: string;
  method: PaymentMethod;
  amountRial: number;
  bankAccountId?: string;
  chequeNumber?: string;
  chequeDueDateJalali?: string;
  chequeStatus?: ChequeStatus;
  journalEntryId?: string;
  status: 'DRAFT' | 'REGISTERED' | 'CLEARED' | 'CANCELLED';
}

export interface Receivable extends BaseCanonicalEntity {
  customerId: string;
  customerNameFa: string;
  invoiceId?: string;
  invoiceNumber?: string;
  invoiceDateJalali: string;
  dueDateJalali: string;
  dueDateGregorian: string;
  originalAmountRial: number;
  remainingAmountRial: number;
  overdueDays: number;
  agingBucket: 'NOT_DUE' | '0_TO_30' | '31_TO_60' | '61_TO_90' | 'ABOVE_90';
  disputed: boolean;
}

export interface Payable extends BaseCanonicalEntity {
  supplierId: string;
  supplierNameFa: string;
  purchaseOrderId?: string;
  dueDateJalali: string;
  originalAmountRial: number;
  remainingAmountRial: number;
  overdueDays: number;
  agingBucket: 'NOT_DUE' | '0_TO_30' | '31_TO_60' | '61_TO_90' | 'ABOVE_90';
}
