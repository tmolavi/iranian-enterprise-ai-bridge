# تغییرات و نسخه‌ها | Changelog

All notable changes to the **Iranian Enterprise AI Bridge** are documented in this file.

## [0.1.0] - 2026-10-02 (Early Release — Functional Foundation)
### Added
- **Monorepo Architecture:** Setup complete TypeScript monorepo with strict typing, NodeNext modules, and topological builds.
- **Canonical Model (`@ieab/canonical-model`):** Standardized enterprise entities for 11 domains (Organizations, Parties, Sales, Procurement, Inventory, Treasury, Accounting, Manufacturing, HR, Governance) with data lineage envelopes.
- **Deterministic Metrics (`@ieab/metrics`):** Authoritative metric calculators for Gross/Net Sales, Cash Position, Accounts Receivable, DSO, OEE, Scrap Rate, Machine Downtime, and Inventory Valuation without LLM arithmetic.
- **Persian & Shamsi Support (`@ieab/shared`):** High-precision Jalali date math with leap years, Persian/Arabic character normalization, and Iranian currency formatters (Rial, Toman, Billion Toman, Hemmat).
- **Security & Policy Engine (`@ieab/policy-engine`):** RBAC role enforcement, PII masking for National ID, IBAN, Mobile, Salary, and SQL Security Guard enforcing read-only queries.
- **Audit Ledger (`@ieab/audit`):** Append-only event tracking recording user identity, role, query, model, tool invocations, durations, and reconciliation states.
- **Connectors Architecture (`connectors/`):**
  - `generic-mssql`: Tested with fixture (`FIXTURE_TESTED` / VF)
  - `csv-excel`: Verified parser (`FIXTURE_TESTED` / VF)
  - `odoo`: Tested with fixture (`FIXTURE_TESTED` / VF)
  - `sepidar`: Schema mapped from community research (`SCAFFOLDED` / TP)
  - `payamgostar`: CRM interface scaffolded (`SCAFFOLDED` / TP)
  - `rahkaran`, `chargoon`, `shauto`: Schema contracts prepared (`REQUIRES_VENDOR_ACCESS` / TP)
- **Executive Copilot (`@ieab/agent-runtime`):** Evidence-first conversational runtime delivering answers to executive questions with explicit `dataMode: FIXTURE` tagging.
- **Strategic CEO Benchmark Catalog & Runner:** Full catalog of 100 documented questions (`docs/fa/CEO-QUESTIONS.md`) with 15 executable fixture-based benchmark test cases.
- **Admin Onboarding Wizard:** Interactive CLI tool generating tailored enterprise configuration files.
- **Executive Web UI:** Interactive Persian RTL interface supporting Now, Exceptions, Why, Next, and Ask tabs.
- **Comprehensive Bilingual Documentation:** 12 in-depth guides in Persian and English.
