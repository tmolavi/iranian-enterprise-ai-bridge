# راهنمای درخواست پاکسازی آبجکت‌های کش‌شده گیت‌هاب | GitHub Cached Object Purge Guide

> **مخاطب:** مالک مخزن (Repository Owner)  
> **موضوع:** پاکسازی کش داخلی سرورهای گیت‌هاب برای کامیت‌های سرگردان (Orphan Commits)

---

## ۱. وضعیت فعلی تاریخچه مخزن (Current Repository Status)

- تاریخچه فعال شاخه `main` و کلیه ارجاعات (Branches & Tags) به طور کامل بازنویسی و پاکسازی شده‌اند.
- در یک Clone تازه از مخزن، هیچ فایل حساسی در هیچ‌کدام از شاخه‌ها و برچسب‌های فعال وجود ندارد (`REMOVED_FROM_ACTIVE_REPOSITORY_HISTORY`).
- با این حال، معماری داخلی GitHub آبجکت‌های کامیت‌های سرگردان (Orphan Objects) را تا زمان اجرای دوره‌ای فرآیند Garbage Collection در حافظه پنهان (Cache / Internal Storage) خود حفظ می‌کند. به همین دلیل ممکن است دسترسی مستقیم از طریق شناسه هش کامل (Direct SHA URL) همچنان پاسخ دهد.

---

## ۲. مشخصات آبجکت و کامیت سرگردان (Orphan Commit Details)

- **Repository:** `tmolavi/iranian-enterprise-ai-bridge`
- **Orphan Commit SHA:** `4ad986690280bbd41d2c83f988663045c163d142`
- **Historical Sensitive Path:** `extracted_data_Meisam_sh/`
- **Active History Status:** کاملاً حذف شده از شاخه `main` و کلیه برچسب‌ها.

---

## ۳. نحوه ارسال درخواست به پشتیبانی گیت‌هاب (GitHub Support Ticket)

مالک مخزن می‌تواند با مراجعه به [GitHub Support Portal](https://support.github.com/contact) درخواست پاکسازی کامل کش سرورها را ارسال نماید:

### فرم ارتباط با پشتیبانی:
- **Category:** Account or Repository Data Removal / Privacy
- **Subject:** Request to purge unreachable/orphan commit objects and cached views for repository `tmolavi/iranian-enterprise-ai-bridge`

### متن پیشنهادی تیکت پشتیبانی (Support Request Template):

```text
Dear GitHub Support Team,

I am the owner of the repository "tmolavi/iranian-enterprise-ai-bridge".

We have completely sanitized and rewritten the active Git history on the `main` branch to remove sensitive data files that were accidentally committed in an early revision. The repository's active branches and tags no longer contain any references to these files.

However, the orphan commit is still retrievable via direct SHA URL view:
- Commit SHA: 4ad986690280bbd41d2c83f988663045c163d142
- File Path: extracted_data_Meisam_sh/Customer.csv

Could you please run a manual `git gc --prune=now` / cache purge on the server-side repository storage to permanently delete all unreachable and orphan commit objects associated with this repository?

Thank you for your assistance.

Best regards,
Taqi Molavi
Repository Owner
```
