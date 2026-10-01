# راهنمای جامع کانکتورها و استانداردهای توسعه (Connector SDK Guide)

## ۱. سلسله‌مراتب روش‌های استخراج (Extraction Priority Hierarchy)

هنگام اتصال به هر سیستم سازمانی، اولویت‌بندی روش استخراج به ترتیب زیر الزامی است:

```
۱. Official REST / Open API (درگاه رسمی با توکن احراز هویت)
       ↓
۲. Official Integration Service / Webhooks (سرویس‌های رسمی رویدادمحور)
       ↓
۳. Reporting API / OData (سرویس‌های گزارش‌گیری سازمانی)
       ↓
۴. Read Replica (AlwaysOn Availability Groups / دیتابیس کپی خواندنی)
       ↓
۵. Change Data Capture (CDC / Change Tracking)
       ↓
۶. Vendor-Supported Views (ویوهای استاندارد تأمین‌کننده)
       ↓
۷. Read-Only SQL (کوئری مستقیم با کاربر محدود شده db_datareader)
       ↓
۸. Controlled Export / File Drop (فایل‌های اکسل و CSV کنترل‌شده)
```

**هرگز در گام اول بدون مطالعه ساختار، کوئری سنگین مستقیم به پایگاه داده عملیاتی ERP ارسال نکنید.**

---

## ۲. تعریف دقیق تکمیل کانکتور (Definition of Done)

یک کانکتور صرفاً با ایجاد چند فایل به عنوان «کامل» شناخته نمی‌شود. تکمیل قطعی کانکتور نیازمند تحقق موارد زیر است:
- [x] مانیفست کامل شامل نسخه، سطح شواهد (VF/TP)، سازنده و دسترسی‌های لازم
- [x] پیاده‌سازی متد `testConnection` و بررسی ایمنی Read-Only
- [x] پیاده‌سازی کشف خودکار اسکیما (`discoverSchema`)
- [x] پیاده‌سازی استخراج دسته‌ای و افزایشی با نشانگر (`extractIncremental`)
- [x] نگاشت بدون تلفات به ساختار کاننیکال (`normalizeToCanonical`)
- [x] مدیریت نرخ درخواست (Rate Limiter) و جلوگیری از فشار به دیتابیس
- [x] تست‌های خودکار یکپارچه در قالب `ConnectorTestHarness`
- [x] مستندسازی شفاف محدودیت‌ها و ملاحظات امنیتی
