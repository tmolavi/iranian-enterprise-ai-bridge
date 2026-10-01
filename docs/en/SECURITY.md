# Enterprise Security, Threat Model & Auditability

## 1. Threat Model Overview

Integrating legacy enterprise ERPs with modern AI agents introduces four primary threat vectors:
1. **Prompt Injection & Data Exfiltration:** Malicious instructions embedded in business documents attempting to bypass tool access boundaries.
2. **PII & Financial Data Leakage:** Unmasked disclosure of Iranian National IDs (کدملی), IBAN numbers (شبا), personal contacts, and executive payroll.
3. **Destructive SQL Execution:** Unintended or adversarial mutations (`UPDATE`, `DROP`, `DELETE`, `EXEC`).
4. **Database Denial of Service (DoS):** Heavy analytical aggregations locking live OLTP transactional tables.

---

## 2. Defensive Controls Implemented

- **Read-Only Enforcement:** Mandatory `ApplicationIntent=ReadOnly` connection strings combined with granular `db_datareader` database users.
- **SQL Security Guard:** Pre-flight statement parser rejecting all mutating, stored procedure, or administrative commands.
- **Automated PII Masking:** Dynamic anonymization of National IDs, IBAN accounts, and phone numbers before caching or LLM synthesis.
- **RBAC Policy Engine:** Fine-grained authorization gates mapped to organizational roles (CEO, CFO, COO, Auditor).
- **Immutable Audit Ledger:** Full event logging recording timestamps, actors, prompt texts, models, executed tool calls, source table identifiers, and reconciliation verification states.
- **Emergency Kill Switch:** Instant operational kill switch (`KILL_SWITCH_ENABLED=true`) disabling AI tool execution without affecting underlying enterprise databases.
