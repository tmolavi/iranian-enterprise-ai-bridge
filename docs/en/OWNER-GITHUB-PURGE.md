# GitHub Cached Object Purge Guide

> **Audience:** Repository Owner  
> **Topic:** Purging server-side cached and orphan Git commit objects on GitHub

---

## 1. Current Active Repository History Status

- The active Git history of the `main` branch and all active refs (branches, tags) has been completely cleaned.
- A fresh clone of the repository contains zero sensitive data files (`REMOVED_FROM_ACTIVE_REPOSITORY_HISTORY`).
- However, GitHub's internal architecture retains unreachable commit objects in its server cache until garbage collection is triggered. Thus, direct SHA URLs may still resolve.

---

## 2. Orphan Object Specifics

- **Repository:** `tmolavi/iranian-enterprise-ai-bridge`
- **Orphan Commit SHA:** `4ad986690280bbd41d2c83f988663045c163d142`
- **Historical Sensitive Path:** `extracted_data_Meisam_sh/`
- **Active History Status:** Completely deleted from active refs.

---

## 3. Submitting a Support Ticket to GitHub

The repository owner can submit a purge request via [GitHub Support](https://support.github.com/contact):

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
