import { BaseCanonicalEntity } from '../base/metadata.js';
export type AccountNature = 'DEBIT' | 'CREDIT' | 'BOTH';
export type AccountLevel = 'GROUP' | 'GENERAL' | 'SUBSIDIARY' | 'DETAIL';
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
    detailAccountId?: string;
    costCenterId?: string;
    projectId?: string;
    descriptionFa: string;
    debitAmountRial: number;
    creditAmountRial: number;
}
export interface JournalEntry extends BaseCanonicalEntity {
    voucherNumber: number;
    dailyNumber?: number;
    voucherDateJalali: string;
    voucherDateGregorian: string;
    fiscalYearJalali: number;
    voucherType: 'OPENING' | 'GENERAL' | 'ADJUSTMENT' | 'PAYROLL' | 'CLOSING' | 'END_OF_YEAR';
    status: 'TEMPORARY' | 'REVIEWED' | 'PERMANENT';
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
//# sourceMappingURL=accounting.d.ts.map