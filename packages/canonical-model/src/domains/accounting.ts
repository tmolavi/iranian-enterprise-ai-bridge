import { BaseCanonicalEntity } from '../base/metadata.js';

export type AccountNature = 'DEBIT' | 'CREDIT' | 'BOTH'; // ماهیت بدهکار یا بستانکار
export type AccountLevel = 'GROUP' | 'GENERAL' | 'SUBSIDIARY' | 'DETAIL'; // گروه، کل، معین، تفصیلی

export interface Account extends BaseCanonicalEntity {
  code: string;
  titleFa: string;
  titleEn?: string;
  level: AccountLevel;
  parentAccountId?: string;
  nature: AccountNature;
  category: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'COGS' | 'EXPENSE' | 'OFF_BALANCE';
  isActive: boolean;
}

export interface JournalEntryLine {
  lineNumber: number;
  accountId: string;
  accountCode: string;
  accountTitleFa: string;
  detailAccountId?: string; // تفصیلی شناور سطح ۴، ۵، ۶
  costCenterId?: string;
  projectId?: string;
  descriptionFa: string;
  debitAmountRial: number;
  creditAmountRial: number;
}

export interface JournalEntry extends BaseCanonicalEntity {
  voucherNumber: number; // شماره سند حسابداری
  dailyNumber?: number; // شماره روزانه
  voucherDateJalali: string;
  voucherDateGregorian: string;
  fiscalYearJalali: number; // e.g. 1403
  voucherType: 'OPENING' | 'GENERAL' | 'ADJUSTMENT' | 'PAYROLL' | 'CLOSING' | 'END_OF_YEAR';
  status: 'TEMPORARY' | 'REVIEWED' | 'PERMANENT'; // یادداشت، موقت، بررسی‌شده، دائم (قطعی)
  descriptionFa: string;
  totalDebitRial: number;
  totalCreditRial: number;
  lines: JournalEntryLine[];
}

export interface Budget extends BaseCanonicalEntity {
  fiscalYearJalali: number;
  accountId: string;
  costCenterId?: string;
  approvedAmountRial: number;
  actualAmountRial: number;
  varianceAmountRial: number;
  variancePercentage: number;
}
