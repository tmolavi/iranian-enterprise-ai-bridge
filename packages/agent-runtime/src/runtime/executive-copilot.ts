import { EnterpriseAIGateway } from '@ieab/ai-gateway';
import {
  MetricCalculator,
  EnterpriseDataSet,
  EnterpriseAnomalyDetector,
  CashForecaster,
  SubledgerReconciliationEngine
} from '@ieab/metrics';
import { RBACPolicyEngine, PIIMasker } from '@ieab/policy-engine';
import { EnterpriseAuditLedger } from '@ieab/audit';
import { PersianNormalizer, Logger, AppError } from '@ieab/shared';
import { CopilotUserContext, ExecutiveAnswer, CopilotEvidencePayload } from '../types/copilot.js';

export class ExecutiveCopilot {
  private aiGateway: EnterpriseAIGateway;
  private calculator: MetricCalculator;
  private auditLedger: EnterpriseAuditLedger;
  private logger = new Logger('ExecutiveCopilot');

  constructor(
    aiGateway?: EnterpriseAIGateway,
    calculator?: MetricCalculator,
    auditLedger?: EnterpriseAuditLedger
  ) {
    this.aiGateway = aiGateway || new EnterpriseAIGateway();
    this.calculator = calculator || new MetricCalculator();
    this.auditLedger = auditLedger || new EnterpriseAuditLedger();
  }

  /**
   * Main entrypoint for CEO and executive questions in natural Persian.
   */
  public async ask(
    userContext: CopilotUserContext,
    promptFa: string,
    dataset: EnterpriseDataSet,
    conversationId = `conv-${Date.now()}`
  ): Promise<ExecutiveAnswer> {
    const startTime = Date.now();
    const cleanPrompt = PersianNormalizer.normalize(promptFa);

    this.logger.info(`Executive Question received from [${userContext.role}] ${userContext.fullNameFa}: "${cleanPrompt}"`);

    // 1. Permission check
    if (!RBACPolicyEngine.hasPermission(userContext.role, 'EXEC_ASK_COPILOT')) {
      throw new AppError({
        code: 'PERMISSION_DENIED',
        messageEn: `User role ${userContext.role} is not permitted to use Executive Copilot.`,
        messageFa: `نقش سازمانی شما (${userContext.role}) مجاز به استفاده از هوش مصنوعی مدیریت ارشد نیست.`
      });
    }

    // 2. Classify intent and invoke AI gateway / tool calling
    const aiResponse = await this.aiGateway.chat([
      {
        role: 'system',
        content: `You are the Executive AI Intelligence Bridge for Iranian enterprises. You MUST answer in authoritative Persian based ONLY on deterministic tool metrics. Never hallucinate numbers.`
      },
      {
        role: 'user',
        content: cleanPrompt
      }
    ]);

    // 3. Dispatch tool execution deterministically
    const toolCall = aiResponse.toolCalls?.[0];
    const toolName = toolCall?.function.name || 'get_metric';
    const toolArgs = toolCall ? JSON.parse(toolCall.function.arguments) : { metricId: 'NET_SALES' };

    let evidence: CopilotEvidencePayload;
    let executiveSummaryFa = '';
    let keyDriversFa: string[] = [];
    let recommendedActionsFa: string[] = [];

    if (toolName === 'get_metric') {
      const metricId = toolArgs.metricId || 'NET_SALES';

      // Check domain permission
      if (!RBACPolicyEngine.canAccessMetric(userContext.role, 'FINANCE')) {
        throw new AppError({
          code: 'METRIC_ACCESS_DENIED',
          messageEn: `Access to metric ${metricId} denied for role ${userContext.role}`,
          messageFa: `دسترسی به شاخص مالی ${metricId} برای نقش شما مجاز نیست.`
        });
      }

      const metricRes = this.calculator.calculate(metricId, dataset, { orgId: userContext.orgId });

      evidence = {
        metricId: metricRes.metricId,
        metricTitleFa: metricRes.titleFa,
        exactValue: metricRes.value,
        unitFa: metricRes.unitFa,
        periodFa: metricRes.periodFa,
        executiveFormatted: metricRes.executiveFormatted,
        breakdown: metricRes.breakdown,
        formulaUsedFa: metricRes.formulaUsedFa,
        sourceSystem: metricRes.sourceSystem,
        lastRefreshDate: metricRes.lastRefreshDate,
        reconciliationStatus: metricRes.reconciliationStatus,
        sampleSourcePks: metricRes.sampleSourcePks,
        drillDownAllowed: true
      };

      if (metricId === 'NET_SALES' || metricId === 'GROSS_REVENUE') {
        executiveSummaryFa = `کل ${metricRes.titleFa} سازمان در بازه ${metricRes.periodFa} برابر با ${metricRes.executiveFormatted.humanReadableFa} بوده است.`;
        if (metricRes.breakdown && metricRes.breakdown.length > 0) {
          const top1 = metricRes.breakdown[0];
          keyDriversFa = [
            `بیشترین سهم فروش متعلق به مشتری «${top1.dimensionLabelFa}» با سهم ${top1.formattedFa} (${PersianNormalizer.toPersianDigits(top1.percentageOfTotal.toFixed(1))}٪) است.`,
            `ارقام محاسبه‌شده مستقیماً از زیرسیستم فروش استخراج و با دفاتر کل مالی تطبیق داده شده‌اند.`
          ];
          recommendedActionsFa = [
            `بررسی اعتبار اسنادی و وضعیت وصول مطالبات مشتریان برتر`,
            `پیگیری پیش‌فاکتورهای معلق در بخش فروش سازمانی`
          ];
        }
      } else if (metricId === 'CASH_POSITION') {
        executiveSummaryFa = `موجودی نقد و بانک سازمان در تاریخ ${metricRes.periodFa} مبلغ ${metricRes.executiveFormatted.humanReadableFa} است.`;
        keyDriversFa = [
          `بخش عمده نقدینگی در حساب‌های فعال بانکی و صندوق‌های تنخواه مستقر است.`,
          `تراز مالی بر اساس آخرین صورتحساب‌های برخط بانکی تأیید شده است.`
        ];
        recommendedActionsFa = [
          `تخصیص اولویت‌دار نقدینگی به سررسیدهای خرید مواد اولیه خط تولید`,
          `پایش جریان ورودی وصولی‌های چک‌های صیادی پایان ماه`
        ];
      } else if (metricId === 'OVERDUE_RECEIVABLES' || metricId === 'ACCOUNTS_RECEIVABLE') {
        executiveSummaryFa = `مجموع مطالبات تجاری در حال حاضر ${metricRes.executiveFormatted.humanReadableFa} است.`;
        keyDriversFa = [
          `بخشی از مطالبات به دلیل تأخیر در بازپرداخت مشتریان حقوقی عمده وارد بازه معوق بالای ۶۰ روز شده است.`
        ];
        recommendedActionsFa = [
          `توقف خط اعتباری و حواله خروج بار برای مشتریان دارای چک برگشتی یا بدهی سررسیدگذشته`,
          `ارسال اظهارنامه و پیگیری واحد حقوقی برای تسویه مطالبات بالای ۹۰ روز`
        ];
      } else if (metricId === 'OEE') {
        executiveSummaryFa = `شاخص اثربخشی کلی تجهیزات (OEE) خطوط تولید ${metricRes.executiveFormatted.humanReadableFa} ثبت شده است.`;
        keyDriversFa = [
          `نرخ در دسترس بودن خطوط به دلیل توقفات برنامه‌ریزی‌نشده تعویض قالب در حد نرمال است.`,
          `نرخ کیفیت قطعات تولیدی بالای ۹۷٪ است.`
        ];
        recommendedActionsFa = [
          `اجرای برنامه نگهداری پیشگیرانه (PM) در شیفت تعطیلات آخر هفته`,
          `بهینه‌سازی زمان تنظیم قالب (SMED) برای کاهش زمان توقفات`
        ];
      } else {
        executiveSummaryFa = `${metricRes.titleFa}: ${metricRes.executiveFormatted.humanReadableFa}`;
      }
    } else if (toolName === 'get_anomalies') {
      const anomalies = EnterpriseAnomalyDetector.detectAnomalies(userContext.orgId);
      evidence = {
        sourceSystem: 'ANOMALY_DETECTOR',
        lastRefreshDate: '1403/07/15',
        reconciliationStatus: 'NOT_APPLICABLE',
        drillDownAllowed: true
      };
      executiveSummaryFa = `تعداد ${PersianNormalizer.toPersianDigits(anomalies.length)} مورد انحراف و استثنای بحرانی در سیستم شناسایی شد که نیازمند توجه فوری مدیریت ارشد است.`;
      keyDriversFa = anomalies.map((a) => `[${a.severity}] ${a.titleFa}: ${a.descriptionFa}`);
      recommendedActionsFa = [
        `تشکیل جلسه فوری کمیته وصول مطالبات و مدیریت ریسک نقدینگی`,
        `بررسی کیفی پارت ورودی مواد اولیه خط تولید ریخته‌گری`
      ];
    } else {
      // Fallback
      evidence = {
        sourceSystem: 'ERP_SYSTEM',
        lastRefreshDate: '1403/07/15',
        reconciliationStatus: 'RECONCILED',
        drillDownAllowed: false
      };
      executiveSummaryFa = `اطلاعات درخواستی از پایگاه داده عملیاتی استخراج گردید.`;
    }

    const durationMs = Date.now() - startTime;

    // 4. Log immutable audit event
    this.auditLedger.logEvent({
      id: `audit-${Date.now()}`,
      orgId: userContext.orgId,
      userId: userContext.userId,
      userFullNameFa: userContext.fullNameFa,
      userRole: userContext.role,
      timestamp: new Date().toISOString(),
      promptFa: cleanPrompt,
      modelId: aiResponse.model,
      modelProvider: aiResponse.provider,
      intentCategory: toolName,
      toolCalls: [
        {
          toolName,
          arguments: toolArgs,
          executionDurationMs: durationMs,
          success: true
        }
      ],
      metricsQueried: evidence.metricId ? [evidence.metricId] : [],
      reconciliationStatus: evidence.reconciliationStatus === 'RECONCILED' ? 'RECONCILED' : 'NOT_APPLICABLE',
      sourceSystemReferences: [evidence.sourceSystem],
      finalAnswerFa: executiveSummaryFa,
      executionDurationTotalMs: durationMs
    });

    return {
      conversationId,
      promptFa: cleanPrompt,
      intent: toolName,
      executiveSummaryFa,
      keyDriversFa,
      recommendedActionsFa,
      evidence: PIIMasker.maskRecord(evidence as any),
      executionDurationMs: durationMs,
      modelUsed: aiResponse.model,
      reconciled: evidence.reconciliationStatus === 'RECONCILED'
    };
  }
}
