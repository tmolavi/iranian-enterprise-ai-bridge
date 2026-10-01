# Iranian Enterprise Software Benchmark & Market Map (ERP 2026)

> **Methodology & Objectivity:** This report is based on deep technical research conducted in 2026. It avoids naive "Best ERP in Iran" rankings and instead provides structured, multi-dimensional decision matrices evaluating functional coverage, data accessibility, and AI integration readiness.

---

## 1. Functional Coverage & Core Architecture

| Product Name | Architectural Classification | Core Database | Finance & Commercial | Manufacturing & MRP | BPMS & Office Automation | Evidence Level |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Rahkaran (System Group)** | Comprehensive Enterprise ERP | MS SQL Server | Very High | High | Medium | **TP** |
| **Didgah (Chargoon)** | BPMS, Automation & Administrative ERP | MS SQL Server | High | Low | Very High | **TP** |
| **ShAuto (Shomaran)** | Industrial & Manufacturing ERP | MS SQL Server | High | Very High (MRP/MPS/CMMS) | Medium | **TP** |
| **Rayvarz** | Process-Driven Enterprise ERP | SQL Server / Oracle | Very High | High | High | **TP** |
| **Sepidar (System Group)** | SME Commercial & Accounting Suite | MS SQL Server | High | Basic | None | **VF** |
| **Odoo (Iran Localized)** | Open-Source Modular ERP | PostgreSQL | Very High | High | High | **VF** |
| **ERPNext (Iran Localized)** | Open-Source Web-Native ERP | MariaDB / Postgres | High | High | High | **VF** |

---

## 2. Data Accessibility Matrix

Data accessibility is the single most critical factor determining AI integration feasibility, latency, and operational cost:

| Product | Official REST/API | Read Replica Support | CDC Support | Schema Complexity | Accessibility Score (1-10) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Generic SQL Server** | Yes (Custom) | Fully Supported (AlwaysOn) | Supported (SQL CDC) | Configurable | **9 / 10** |
| **Odoo (Iran Localized)** | Native (JSON-RPC / REST) | Supported (Postgres Replica) | Supported (Wal2Json) | Clean & Documented | **9.5 / 10** |
| **ERPNext (Iran Localized)**| Native (Comprehensive REST) | Supported (MariaDB Replica) | Supported | Standardized | **9 / 10** |
| **Sepidar** | No (Direct SQL Standard) | Supported | Requires Setup | Clean & Direct | **7.5 / 10** |
| **Rahkaran** | Gated (Web API License) | Supported (AlwaysOn) | Supported | Multi-level Floating Details | **6.5 / 10** |
| **Didgah Chargoon** | Supported (SOAP / REST) | Supported | Medium | Proprietary BPMS XML | **7 / 10** |
| **Shomaran System** | Custom Views / SQL | Supported | Supported | Specialized Production Tables | **6.5 / 10** |

---

## 3. Decision Framework by Organization Archetype

### A. Manufacturing & Heavy Industrial Plants
- **Key Needs:** Material consumption tracking, BOM revisions, machine downtime (MTBF/MTTR), and shop-floor OEE.
- **Recommended Systems:** Shomaran System (ShAuto), Rahkaran (Industrial Costing module), Odoo Manufacturing.
- **AI Strategy:** Deploy AlwaysOn Read Replica on SQL Server; calculate OEE and scrap rates deterministically via `@ieab/metrics`.

### B. Conglomerates & Multi-Entity Holdings
- **Key Needs:** Intercompany consolidation, treasury visibility, and group cash management.
- **Recommended Systems:** Rahkaran, Rayvarz, Odoo Multi-Company.
- **AI Strategy:** Utilize `@ieab/canonical-model` as the unified aggregation layer across heterogeneous subsidiary ERPs.

### C. Agile & AI-First Organizations
- **Key Needs:** Full API accessibility, zero vendor data lock-in, rapid integration with LLM agents.
- **Recommended Systems:** Odoo, ERPNext, or custom PostgreSQL/SQL Server data platforms.
