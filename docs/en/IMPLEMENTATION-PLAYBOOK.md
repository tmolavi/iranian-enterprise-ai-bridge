# Zero-to-Production Implementation Playbook & 12-Week PoC
## Step-by-Step Practical Blueprint for Enterprise AI Integration in Iranian Industry

This playbook provides an actionable roadmap allowing Iranian manufacturing plants and holding companies to transition smoothly from legacy data silos to governed AI executive intelligence.

---

## 1. The 14 Implementation Phases

1. **Phase 0 — Executive Discovery:** Clarify 5 to 10 daily mission-critical CEO questions. Exit Gate: Signed list of core questions.
2. **Phase 1 — System Inventory:** Catalog operational ERPs (Rahkaran, ShAuto, Sepidar, Chargoon), database engines, and access paths.
3. **Phase 2 — Data-Access Proof:** Provision dedicated read-only database users (`db_datareader`) or AlwaysOn Read Replicas.
4. **Phase 3 — Read-Only Extraction:** Execute throttled test extraction batches via `@ieab/connector-sdk` ensuring zero impact on OLTP performance.
5. **Phase 4 — Canonical Mapping:** Transform raw records into `@ieab/canonical-model` entities preserving source lineage (`sourcePk`) and Jalali timestamps.
6. **Phase 5 — KPI Contracts:** Formalize mathematical formulas for Net Sales, Gross Margin, and DSO in `@ieab/semantic` with CFO sign-off.
7. **Phase 6 — Subledger Reconciliation:** Run `@ieab/metrics` reconciliation engine to verify that subledger sales and inventory balance against general ledger accounts.
8. **Phase 7 — Executive Dashboard (Now):** Deploy executive monitoring cards displaying authoritative numbers.
9. **Phase 8 — Ask Data:** Connect conversational AI for natural language Persian querying backed strictly by deterministic tools.
10. **Phase 9 — Root-Cause Analysis (Why):** Enable dimensional decomposition and top driver identification.
11. **Phase 10 — Anomaly Monitoring (Exceptions):** Activate automated business exception scanners.
12. **Phase 11 — Cash Forecasting (Next):** Implement 30/60-day cash flow projections with prediction bounds.
13. **Phase 12 — Smart Recommendations:** Experimental recommendation rules for working capital and inventory optimization.
14. **Phase 13 — Approved Actions:** Human-in-the-loop approved bounded actions.

---

## 2. 12-Week PoC Execution Roadmap

| Week | Focus Area | Responsible Role | Key Deliverable |
| :---: | :--- | :---: | :--- |
| **W1** | Executive discovery and definition of 10 core questions | CEO / Project Lead | Signed PoC Charter |
| **W2** | Infrastructure setup and Read-Only replica user creation | DBA / ERP Lead | Verified Read-Only Connectivity |
| **W3** | Deploy monorepo and connect `@ieab/connector-generic-mssql` | Data Engineer | 1,000 Sample Extracted Records |
| **W4** | Canonical mapping for Sales & Customer domains | Data Engineer | Validated Canonical Entities |
| **W5** | Metric definition workshop with CFO | CFO | Approved Metric Contracts in Semantic Layer |
| **W6** | Subledger-to-GL reconciliation testing | CFO / Data Engineer | Verified `RECONCILED` Status |
| **W7** | Local LLM inference server deployment (vLLM / Qwen 2.5 72B) | AI / Infra Engineer | Operational Local OpenAI Endpoint |
| **W8** | Deterministic tool calling integration (`get_metric`) | AI Engineer | Working Tool Invocation Pipeline |
| **W9** | Deploy Executive Web Interface (`apps/executive-web`) | Frontend Lead | Live Executive Dashboard |
| **W10** | CEO interactive testing & evaluation | CEO | Benchmark Scorecard & Feedback |
| **W11** | Security audit, PII data masking, and log verification | CISO / Data Engineer | Immutable Audit Trail Report |
| **W12** | Executive board demonstration and production rollout plan | CEO / Stakeholders | Enterprise Production Go/No-Go Decision |
