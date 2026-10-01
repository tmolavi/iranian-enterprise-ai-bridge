import { PersianNormalizer } from '@ieab/shared';
import fs from 'node:fs';
import path from 'node:path';

export interface OnboardingProfile {
  organizationName: string;
  industry: 'MANUFACTURING' | 'HOLDING' | 'COMMERCIAL' | 'SERVICES' | 'GOVERNMENT' | 'SME';
  erpVendor: string;
  crmSystem?: string;
  databaseType: 'MSSQL' | 'ORACLE' | 'POSTGRES' | 'MYSQL' | 'UNKNOWN';
  dataAccessPath: 'READ_REPLICA' | 'CDC' | 'READONLY_SQL' | 'API' | 'FILE_DROP';
  deploymentModel: 'FULLY_ON_PREMISE' | 'HYBRID' | 'CLOUD';
  hasDedicatedDBA: boolean;
  hasERPExpert: boolean;
}

export class OrganizationOnboardingWizard {
  public static generatePlaybook(profile: OnboardingProfile): Record<string, unknown> {
    const orgName = PersianNormalizer.normalize(profile.organizationName);

    // 1. Recommended connector
    let connectorId = 'generic-mssql';
    if (profile.erpVendor.includes('همکاران') || profile.erpVendor.toLowerCase().includes('rahkaran')) {
      connectorId = 'rahkaran-systemgroup';
    } else if (profile.erpVendor.includes('چارگون') || profile.erpVendor.toLowerCase().includes('chargoon')) {
      connectorId = 'chargoon-didgah';
    } else if (profile.erpVendor.includes('شماران') || profile.erpVendor.toLowerCase().includes('shauto')) {
      connectorId = 'shauto-shomaran';
    } else if (profile.erpVendor.includes('سپیدار') || profile.erpVendor.toLowerCase().includes('sepidar')) {
      connectorId = 'sepidar-systemgroup';
    } else if (profile.erpVendor.toLowerCase().includes('odoo')) {
      connectorId = 'odoo-iran-localized';
    }

    // 2. Initial KPI set tailored to industry
    const kpis = ['NET_SALES', 'CASH_POSITION', 'OVERDUE_RECEIVABLES'];
    if (profile.industry === 'MANUFACTURING') {
      kpis.push('OEE', 'PRODUCTION_SCRAP_RATE', 'MACHINE_DOWNTIME_HOURS', 'INVENTORY_VALUE');
    } else if (profile.industry === 'HOLDING') {
      kpis.push('GROSS_MARGIN_PERCENT', 'COGS', 'DSO');
    }

    // 3. Recommended AI model setup
    const aiConfig = {
      modelProvider: profile.deploymentModel === 'FULLY_ON_PREMISE' ? 'LOCAL_VLLM' : 'OPENAI_OR_LOCAL',
      recommendedModel: profile.deploymentModel === 'FULLY_ON_PREMISE' ? 'Qwen/Qwen2.5-72B-Instruct-GPTQ / DeepSeek-R1-Distill-Qwen-32B' : 'gpt-4o / claude-3-5-sonnet',
      hardwareEstimate: profile.deploymentModel === 'FULLY_ON_PREMISE' ? '2x NVIDIA RTX 3090/4090 (24GB VRAM each)' : 'No GPU required on-prem (Cloud AI Gateway)'
    };

    return {
      organization: {
        nameFa: orgName,
        industry: profile.industry,
        erpSystem: profile.erpVendor,
        recommendedConnector: connectorId
      },
      architecture: {
        accessPath: profile.dataAccessPath,
        deployment: profile.deploymentModel,
        aiStrategy: aiConfig
      },
      firstSprintKPIs: kpis,
      securityChecklist: [
        'ایجاد کاربر SQL با دسترسی صرفاً خواندنی (db_datareader) بدون دسترسی تغییر داده',
        'فعال‌سازی مسیریابی AlwaysOn Read-Only Routing یا اسنپ‌شات مجزا برای عدم افت سرعت ERP اصلی',
        'فعال‌سازی ماسک خودکار داده‌های هویتی و پرسنلی (کدملی، شبا، حقوق)',
        'پیکربندی Kill-Switch و لاگ تغییرناپذیر کلیه پرسش‌ها در دفترکل ممیزی (Audit Ledger)'
      ],
      raciRolesRequired: [
        { role: 'مدیرعامل / مالک سازمان', duty: 'تعیین اولویت‌های استراتژیک و تأیید مادیات شاخص‌ها' },
        { role: 'مدیر مالی (CFO)', duty: 'مالکیت فرمول شاخص‌های سود، فروش و تطبیق دفاتر کل با زیرسیستم‌ها' },
        { role: 'متخصص ERP سازمان', duty: 'توضیح جداول، فیلدها و منطق انبار و فروش به مهندس داده' },
        { role: 'مهندس داده / هوش مصنوعی', duty: 'استقرار Bridge و اتصال Semantic Layer بدون بازنویسی منطق مالی' }
      ]
    };
  }
}

// Simple CLI runner
if (process.argv[1]?.endsWith('wizard-cli.js')) {
  console.log('🏛️ IRANIAN ENTERPRISE AI BRIDGE — ONBOARDING WIZARD');
  console.log('====================================================\n');

  const sampleProfile: OnboardingProfile = {
    organizationName: 'شرکت تولیدی فولاد کاوه',
    industry: 'MANUFACTURING',
    erpVendor: 'راهکاران همکاران سیستم',
    databaseType: 'MSSQL',
    dataAccessPath: 'READ_REPLICA',
    deploymentModel: 'FULLY_ON_PREMISE',
    hasDedicatedDBA: true,
    hasERPExpert: true
  };

  const plan = OrganizationOnboardingWizard.generatePlaybook(sampleProfile);
  console.log(JSON.stringify(plan, null, 2));

  // Write sample config
  const outPath = path.resolve(process.cwd(), 'ieab.config.sample.json');
  fs.writeFileSync(outPath, JSON.stringify(plan, null, 2), 'utf8');
  console.log(`\n✅ پیکربندی و برنامه استقرار در فایل ${outPath} ذخیره شد.`);
}
