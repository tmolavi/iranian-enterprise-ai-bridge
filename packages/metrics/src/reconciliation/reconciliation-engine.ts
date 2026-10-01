import { Invoice, JournalEntry, InventoryItem } from '@ieab/canonical-model';
import { IranianCurrencyFormatter } from '@ieab/shared';

export interface ReconciliationReport {
  orgId: string;
  checkedAt: string;
  isFullyReconciled: boolean;
  salesSubledgerDiffRial: number;
  inventorySubledgerDiffRial: number;
  salesSubledgerStatus: 'RECONCILED' | 'MISMATCH_DETECTED';
  inventorySubledgerStatus: 'RECONCILED' | 'MISMATCH_DETECTED';
  notesFa: string[];
}

export class SubledgerReconciliationEngine {
  public static reconcile(
    orgId: string,
    invoices: Invoice[],
    journalEntries: JournalEntry[],
    inventoryItems: InventoryItem[]
  ): ReconciliationReport {
    // 1. Reconcile Sales Subledger vs Journal entries for Revenue Account (Code: 410101)
    const totalSubledgerSales = invoices
      .filter((i) => i.orgId === orgId && i.status !== 'CANCELLED')
      .reduce((sum, i) => sum + i.totalNetAmountRial, 0);

    const totalGLSales = journalEntries
      .filter((j) => j.orgId === orgId)
      .flatMap((j) => j.lines)
      .filter((l) => l.accountCode.startsWith('41')) // Revenue accounts
      .reduce((sum, l) => sum + l.creditAmountRial, 0);

    const salesDiff = Math.abs(totalSubledgerSales - totalGLSales);
    const isSalesReconciled = salesDiff === 0 || salesDiff < 1000; // Allow 1000 Rials rounding

    // 2. Reconcile Inventory Subledger vs Journal entries for Inventory Account (Code: 110501)
    const totalSubledgerInventory = inventoryItems
      .filter((item) => item.orgId === orgId)
      .reduce((sum, item) => sum + item.totalValueRial, 0);

    const totalGLInventory = journalEntries
      .filter((j) => j.orgId === orgId)
      .flatMap((j) => j.lines)
      .filter((l) => l.accountCode.startsWith('1105')) // Inventory Asset accounts
      .reduce((sum, l) => sum + (l.debitAmountRial - l.creditAmountRial), 0);

    const inventoryDiff = Math.abs(totalSubledgerInventory - totalGLInventory);
    const isInventoryReconciled = inventoryDiff === 0 || inventoryDiff < 1000;

    const notes: string[] = [];
    if (isSalesReconciled) {
      notes.push('فروش زیرسیستم با اسناد کل حسابداری کاملاً منطبق است.');
    } else {
      notes.push(`مغایرت ${IranianCurrencyFormatter.formatExecutive(salesDiff, 'TOMAN').humanReadableFa} بین فاکتورهای فروش و اسناد دوبل حسابداری شناسایی شد.`);
    }

    if (isInventoryReconciled) {
      notes.push('ارزش ریالی کاردکس انبار با مانده سرفصل موجودی کالا در تراز آزمایشی منطبق است.');
    } else {
      notes.push(`مغایرت ${IranianCurrencyFormatter.formatExecutive(inventoryDiff, 'TOMAN').humanReadableFa} در کاردکس انبار و حسابداری صنعتی وجود دارد.`);
    }

    return {
      orgId,
      checkedAt: new Date().toISOString(),
      isFullyReconciled: isSalesReconciled && isInventoryReconciled,
      salesSubledgerDiffRial: salesDiff,
      inventorySubledgerDiffRial: inventoryDiff,
      salesSubledgerStatus: isSalesReconciled ? 'RECONCILED' : 'MISMATCH_DETECTED',
      inventorySubledgerStatus: isInventoryReconciled ? 'RECONCILED' : 'MISMATCH_DETECTED',
      notesFa: notes
    };
  }
}
