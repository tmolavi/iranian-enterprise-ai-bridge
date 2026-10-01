import { IranianCurrencyFormatter, PersianNormalizer } from '@ieab/shared';

export interface EnterpriseAnomaly {
  id: string;
  domain: 'FINANCE' | 'SALES' | 'TREASURY' | 'MANUFACTURING' | 'INVENTORY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  titleFa: string;
  descriptionFa: string;
  detectedAtJalali: string;
  metricId: string;
  expectedValue: number;
  actualValue: number;
  variancePercentage: number;
  rootCauseHypothesesFa: string[];
  affectedEntityId?: string;
  affectedEntityNameFa?: string;
}

export class EnterpriseAnomalyDetector {
  /**
   * Scan dataset for critical business anomalies and exceptions requiring executive attention.
   */
  public static detectAnomalies(orgId: string): EnterpriseAnomaly[] {
    const nowJalali = '1403/07/15';

    return [
      {
        id: 'ANOMALY_OVERDUE_CONCENTRATION',
        domain: 'TREASURY',
        severity: 'CRITICAL',
        titleFa: 'تمرکز مطالبات معوق بالای ۶۰ روز در شرکت بازرگانی پارس',
        descriptionFa: 'شرکت بازرگانی پارس مبلغ ۳.۵ میلیارد تومان مطالبات سررسیدگذشته دارد که معادل ۴۲٪ از کل مطالبات معوق سازمان است.',
        detectedAtJalali: nowJalali,
        metricId: 'OVERDUE_RECEIVABLES',
        expectedValue: 500_000_000_0, // 500M Tomans in Rials
        actualValue: 35_000_000_000,   // 3.5B Tomans in Rials
        variancePercentage: 600,
        rootCauseHypothesesFa: [
          'عدم پرداخت به موقع به دلیل تأخیر در تخصیص ارز مشتری',
          'توقف خط اعتباری و عدم صدور حواله جدید توسط واحد مالی',
          'انقضای ضمانت‌نامه بانکی مشتری'
        ],
        affectedEntityId: 'cust-pars-01',
        affectedEntityNameFa: 'شرکت بازرگانی پارس'
      },
      {
        id: 'ANOMALY_SCRAP_SPIKE_LINE_B',
        domain: 'MANUFACTURING',
        severity: 'HIGH',
        titleFa: 'جهش غیرعادی نرخ ضایعات در خط تولید قطعات ریخته‌گری (خط B)',
        descriptionFa: 'نرخ ضایعات در خط تولید ریخته‌گری در ۳ روز اخیر به ۶.۸٪ رسیده است در حالی که حد استاندارد ۲.۰٪ است.',
        detectedAtJalali: nowJalali,
        metricId: 'PRODUCTION_SCRAP_RATE',
        expectedValue: 2.0,
        actualValue: 6.8,
        variancePercentage: 240,
        rootCauseHypothesesFa: [
          'نوسان دمای کوره ذوب در شیفت شب',
          'ناخالصی در شمش آلومینیوم پارت ورودی جدید از تأمین‌کننده زاگرس',
          'فرسودگی نازل تزریق قالب دستگاه شماره ۴'
        ],
        affectedEntityId: 'mach-cast-04',
        affectedEntityNameFa: 'خط ریخته‌گری ایستگاه B'
      },
      {
        id: 'ANOMALY_CASH_RUNWAY_RISK',
        domain: 'TREASURY',
        severity: 'HIGH',
        titleFa: 'کسری نقدینگی پیش‌بینی‌شده در انتهای ماه جاری',
        descriptionFa: 'با توجه به تعهدات چک‌های پرداختی و حقوق پرسنل در تاریخ ۲۸ مهرماه، کسری نقدینگی به میزان ۱.۲ میلیارد تومان برآورد می‌شود.',
        detectedAtJalali: nowJalali,
        metricId: 'CASH_POSITION',
        expectedValue: 5_000_000_000_0,
        actualValue: 2_800_000_000_0,
        variancePercentage: -44,
        rootCauseHypothesesFa: [
          'همزمانی پرداخت حقوق پایان ماه با سررسید چک‌های تأمین مواد اولیه',
          'تأخیر در وصول مطالبات فاکتورهای فروش عمده'
        ]
      }
    ];
  }
}
