/**
 * Strategic CEO Benchmark Dataset for Iranian Enterprises.
 * - Full Catalog: 100 Documented Questions (docs/fa/CEO-QUESTIONS.md)
 * - Executable Benchmark Cases: 15 Sample Cases verified with synthetic enterprise fixtures.
 */

export interface CEOBenchmarkCase {
  id: string;
  category: 'FINANCE' | 'TREASURY' | 'SALES' | 'PROCUREMENT' | 'INVENTORY' | 'PRODUCTION' | 'QUALITY' | 'MAINTENANCE' | 'HR' | 'GOVERNANCE' | 'RISK';
  questionFa: string;
  questionEn: string;
  requiredSystems: string[];
  requiredEntities: string[];
  requiredMetrics: string[];
  expectedToolSequence: string[];
  expectedEvidenceKey: string;
  failureConditionsFa: string[];
}

export const CEO_QUESTION_CATALOG_TOTAL_COUNT = 100;

export const CEO_EXECUTABLE_BENCHMARK_CASES: CEOBenchmarkCase[] = [
  // 1. Finance & Profitability (1-5)
  {
    id: 'CEO_Q_001',
    category: 'FINANCE',
    questionFa: 'فروش این ماه چرا نسبت به ماه قبل کاهش پیدا کرده است؟',
    questionEn: 'Why did net sales decrease this month compared to last month?',
    requiredSystems: ['Rahkaran/MSSQL', 'Sales Module'],
    requiredEntities: ['Invoice', 'InvoiceLine', 'Customer', 'Product'],
    requiredMetrics: ['NET_SALES', 'GROSS_MARGIN_PERCENT'],
    expectedToolSequence: ['get_metric', 'breakdown_metric', 'get_variance'],
    expectedEvidenceKey: 'NET_SALES',
    failureConditionsFa: ['عدم تفکیک مشتریان عامل کاهش فروش', 'اتکا به تخمین بدون ارجاع به فاکتور قطعی']
  },
  {
    id: 'CEO_Q_002',
    category: 'FINANCE',
    questionFa: 'سود ناخالص و حاشیه سود به تفکیک خطوط اصلی محصول چقدر است؟',
    questionEn: 'What is the gross profit and gross margin broken down by product line?',
    requiredSystems: ['ERP Finance & Costing'],
    requiredEntities: ['InvoiceLine', 'Product', 'Category'],
    requiredMetrics: ['GROSS_PROFIT', 'GROSS_MARGIN_PERCENT'],
    expectedToolSequence: ['get_metric', 'breakdown_metric'],
    expectedEvidenceKey: 'GROSS_MARGIN_PERCENT',
    failureConditionsFa: ['عدم کسر بهای تمام‌شده واقعی (COGS)']
  },
  {
    id: 'CEO_Q_003',
    category: 'FINANCE',
    questionFa: 'بهای تمام‌شده کالای فروش‌رفته (COGS) نسبت به بودجه مصوب چقدر انحراف دارد؟',
    questionEn: 'What is the variance between actual COGS and approved budget?',
    requiredSystems: ['ERP Accounting & Budget'],
    requiredEntities: ['JournalEntry', 'Budget', 'CostCenter'],
    requiredMetrics: ['COGS'],
    expectedToolSequence: ['get_metric', 'get_variance'],
    expectedEvidenceKey: 'COGS',
    failureConditionsFa: ['استفاده از بهای استاندارد به جای بهای واقعی پس از بستن انبار']
  },
  {
    id: 'CEO_Q_004',
    category: 'FINANCE',
    questionFa: 'کدام مراکز هزینه در سه ماهه گذشته بیشترین انحراف منفی از بودجه را داشته‌اند؟',
    questionEn: 'Which cost centers experienced the highest negative budget variance in Q2?',
    requiredSystems: ['Financial Ledger'],
    requiredEntities: ['CostCenterEntry', 'Budget', 'Department'],
    requiredMetrics: ['COGS'],
    expectedToolSequence: ['get_metric', 'breakdown_metric'],
    expectedEvidenceKey: 'COGS',
    failureConditionsFa: ['عدم تطبیق با اسناد قطعی دوبل']
  },
  {
    id: 'CEO_Q_005',
    category: 'FINANCE',
    questionFa: 'درآمد عملیاتی کل سازمان در نیمه اول سال چقدر بوده و با دوره مشابه سال قبل چه تغییری داشته؟',
    questionEn: 'What was total operating revenue in H1 compared to the same period last year?',
    requiredSystems: ['Sales Subledger', 'General Ledger'],
    requiredEntities: ['Invoice', 'Return'],
    requiredMetrics: ['NET_SALES'],
    expectedToolSequence: ['get_metric', 'compare_metric'],
    expectedEvidenceKey: 'NET_SALES',
    failureConditionsFa: ['عدم لحاظ اثر تورم و مقادیر مقداری فروش']
  },

  // 2. Treasury & Cash Flow (11-13)
  {
    id: 'CEO_Q_011',
    category: 'TREASURY',
    questionFa: 'موجودی نقد و بانک آزاد سازمان امروز چقدر است و تا پایان ماه با چه تعهداتی روبرو هستیم؟',
    questionEn: 'What is our current liquid cash and bank position versus committed liabilities this month?',
    requiredSystems: ['Treasury & Bank Module'],
    requiredEntities: ['BankAccount', 'CashAccount', 'Payment', 'Receipt'],
    requiredMetrics: ['CASH_POSITION'],
    expectedToolSequence: ['get_metric', 'get_cash_forecast'],
    expectedEvidenceKey: 'CASH_POSITION',
    failureConditionsFa: ['لحاظ نکردن چک‌های صیادی در جریان وصول و اسناد در راه']
  },
  {
    id: 'CEO_Q_012',
    category: 'TREASURY',
    questionFa: 'دوره وصول مطالبات (DSO) سازمان چند روز است و وضعیت مطالبات معوق بالای ۶۰ روز چگونه است؟',
    questionEn: 'What is our DSO and what is the status of 60+ days overdue receivables?',
    requiredSystems: ['Receivables Module'],
    requiredEntities: ['Receivable', 'Customer', 'Invoice'],
    requiredMetrics: ['DSO', 'OVERDUE_RECEIVABLES'],
    expectedToolSequence: ['get_metric', 'breakdown_metric'],
    expectedEvidenceKey: 'OVERDUE_RECEIVABLES',
    failureConditionsFa: ['عدم تفکیک مطالبات دارای چک معتبر از مطالبات دفتری بدون تضمین']
  },
  {
    id: 'CEO_Q_013',
    category: 'TREASURY',
    questionFa: 'کدام مشتریان سقف اعتباری مجاز خود را رد کرده‌اند اما همچنان سفارش ثبت می‌کنند؟',
    questionEn: 'Which customers exceeded their credit limits yet continue placing orders?',
    requiredSystems: ['Sales & Commercial Policy'],
    requiredEntities: ['Customer', 'Receivable', 'SalesOrder'],
    requiredMetrics: ['ACCOUNTS_RECEIVABLE'],
    expectedToolSequence: ['get_metric', 'get_anomalies'],
    expectedEvidenceKey: 'ACCOUNTS_RECEIVABLE',
    failureConditionsFa: ['عدم استخراج سقف اعتبار ثبت‌شده در سیستم فروش']
  },

  // 3. Manufacturing, OEE & Shop Floor (21-23)
  {
    id: 'CEO_Q_021',
    category: 'PRODUCTION',
    questionFa: 'اثربخشی کلی تجهیزات (OEE) کارخانه در ماه گذشته چقدر بوده و گلوگاه اصلی کجاست؟',
    questionEn: 'What was plant OEE last month and where is the primary production bottleneck?',
    requiredSystems: ['Manufacturing Execution / Shop Floor / CMMS'],
    requiredEntities: ['Machine', 'WorkCenter', 'Downtime', 'QualityInspection'],
    requiredMetrics: ['OEE', 'MACHINE_DOWNTIME_HOURS'],
    expectedToolSequence: ['get_metric', 'breakdown_metric'],
    expectedEvidenceKey: 'OEE',
    failureConditionsFa: ['محاسبه OEE بدون داده‌های توقفات واقعی سالن تولید']
  },
  {
    id: 'CEO_Q_022',
    category: 'PRODUCTION',
    questionFa: 'نرخ ضایعات تولید در کدام خطوط از حد استاندارد فراتر رفته و ارزش ریالی آن چقدر است؟',
    questionEn: 'Which production lines exceeded scrap thresholds and what is the cost impact?',
    requiredSystems: ['QC & Production Module'],
    requiredEntities: ['QualityInspection', 'Waste', 'ProductionOrder'],
    requiredMetrics: ['PRODUCTION_SCRAP_RATE'],
    expectedToolSequence: ['get_metric', 'breakdown_metric'],
    expectedEvidenceKey: 'PRODUCTION_SCRAP_RATE',
    failureConditionsFa: ['تفکیک نکردن ضایعات عادی فرمول ساخت از ضایعات غیرعادی']
  },
  {
    id: 'CEO_Q_023',
    category: 'PRODUCTION',
    questionFa: 'درصد تحقق برنامه تولید مصوب هیئت‌مدیره در این فصل چقدر است؟',
    questionEn: 'What is the attainment rate of board-approved production plan this quarter?',
    requiredSystems: ['MPS / MRP Module'],
    requiredEntities: ['ProductionOrder', 'Product'],
    requiredMetrics: ['PLAN_ATTAINMENT'],
    expectedToolSequence: ['get_metric'],
    expectedEvidenceKey: 'PLAN_ATTAINMENT',
    failureConditionsFa: ['شمارش محصولات نیمه‌ساخته به عنوان محصول نهایی قابل تحویل']
  },

  // 4. Inventory & Supply Chain (36-37)
  {
    id: 'CEO_Q_036',
    category: 'INVENTORY',
    questionFa: 'ارزش کل موجودی راکد و کم‌گردش انبار چقدر است و چه کالاهایی بیش از ۶ ماه حرکت نداشته‌اند؟',
    questionEn: 'What is the value of dead/slow-moving inventory and which items had zero movement for 6+ months?',
    requiredSystems: ['Warehouse Cardex'],
    requiredEntities: ['InventoryItem', 'InventoryMovement', 'Product', 'Warehouse'],
    requiredMetrics: ['INVENTORY_VALUE'],
    expectedToolSequence: ['get_metric', 'breakdown_metric'],
    expectedEvidenceKey: 'INVENTORY_VALUE',
    failureConditionsFa: ['عدم ارجاع به تاریخ آخرین حواله مصرف یا خروج کالا']
  },
  {
    id: 'CEO_Q_037',
    category: 'INVENTORY',
    questionFa: 'موجودی کدام مواد اولیه استراتژیک به زیر نقطه سفارش بحرانی رسیده است؟',
    questionEn: 'Which strategic raw materials dropped below safety stock and critical reorder points?',
    requiredSystems: ['Warehouse & MRP'],
    requiredEntities: ['InventoryItem', 'Product', 'PurchaseOrder'],
    requiredMetrics: ['INVENTORY_VALUE'],
    expectedToolSequence: ['get_metric', 'get_anomalies'],
    expectedEvidenceKey: 'INVENTORY_VALUE',
    failureConditionsFa: ['لحاظ نکردن سفارشات خرید صادرشده در راه']
  },

  // 5. Governance, Audit & Risk (51-52)
  {
    id: 'CEO_Q_051',
    category: 'GOVERNANCE',
    questionFa: 'وضعیت اجرای مصوبات آخرین جلسه هیئت‌مدیره و تکالیف معوق مدیران چگونه است؟',
    questionEn: 'What is the completion status of resolutions and overdue action items from the last board meeting?',
    requiredSystems: ['BPMS / Secretariat / Minutes'],
    requiredEntities: ['Meeting', 'Decision', 'ActionItem', 'Employee'],
    requiredMetrics: [],
    expectedToolSequence: ['search_decisions'],
    expectedEvidenceKey: 'Decision',
    failureConditionsFa: ['عدم تفکیک تکالیف انجام‌شده از مصوبات در جریان']
  },
  {
    id: 'CEO_Q_052',
    category: 'RISK',
    questionFa: 'چه قراردادهای عمده فروش یا خریدی در ۳۰ روز آینده منقضی می‌شوند و ضمانت‌نامه‌های مربوطه در چه وضعیتی هستند؟',
    questionEn: 'Which major contracts expire in the next 30 days and what is the status of related bank guarantees?',
    requiredSystems: ['Legal & Contracts Subsystem'],
    requiredEntities: ['Contract', 'Customer', 'Supplier'],
    requiredMetrics: [],
    expectedToolSequence: ['search_documents'],
    expectedEvidenceKey: 'Contract',
    failureConditionsFa: ['عدم استخراج سررسید ضمانت‌نامه بانکی']
  }
];

export const CEO_EXECUTABLE_BENCHMARK_COUNT = 15;

/** Backward compatibility alias */
export const CEO_BENCHMARK_100 = CEO_EXECUTABLE_BENCHMARK_CASES;
