# راهنمای راه‌اندازی سریع (Quick Start Guide)

## ۱. پیش‌نیازها
- Node.js نسخه 20 به بالا
- سرور پایگاه داده یا کپی خواندنی (Read Replica) نرم‌افزار سازمانی
- سیستم‌عامل لینوکس (Ubuntu 22.04+) یا مک یا ویندوز

---

## ۲. مراحل راه‌اندازی در پنج دقیقه

```bash
# ۱. دریافت کد مخزن
git clone https://github.com/iranian-enterprise-ai-bridge/ieab.git
cd ieab

# ۲. نصب وابستگی‌های مونو‌ریپو
npm install

# ۳. کامپایل تایپ‌اسکریپت و اجرای تست‌ها
npm run build
npm test

# ۴. اجرای ارزیابی بنچمارک ۱۰۰ سؤال مدیرعامل
npm run benchmark

# ۵. اجرای ویزارد تنظیمات سازمان
npm run wizard

# ۶. اجرای سرور API
npm run start:api
```

پس از اجرای سرور API، وب‌اپلیکیشن اجرایی را باز کنید:
```bash
node apps/executive-web/server.js
```
سپس به آدرس `http://localhost:3001` در مرورگر خود مراجعه نمایید.
