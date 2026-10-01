# Organization & Governance Guide (RACI Matrix)
## Defining Responsibilities for Enterprise AI Implementation in Iranian Organizations

A primary cause of AI project failure in enterprises is role confusion. This guide defines unambiguous boundaries for all organizational stakeholders.

---

## 1. Core Division of Responsibilities

1. **ERP Specialist:** Understands internal tables, business workflows, configuration codes, and operational data semantics. They are not expected to design LLM context windows or vector databases.
2. **Data / Analytics Engineer:** Transforms raw transactional tables into clean, governed, and normalized canonical data models.
3. **AI / Agent Engineer:** Optimizes tool routing, prompt reasoning, context management, and local inference engines. **They must NEVER redefine financial or operational truth.**
4. **Chief Financial Officer (CFO):** Owns the authoritative mathematical definitions of Revenue, COGS, Gross Margin, DSO, and Cash Runway.
5. **Chief Operating Officer (COO) / Plant Manager:** Owns definitions for OEE, machine downtime categories, and scrap formulas.
6. **Chief Executive Officer (CEO) / Owner:** Defines executive decision materiality, core strategic priorities, and autonomous action boundaries—not database schemas.

---

## 2. RACI Matrix

| Key Phase / Decision | CEO | CFO | COO | CIO/CTO | ERP Lead | Data Eng | AI Eng | CISO / Sec |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. Strategic Business Priorities & 10 Core Questions** | **A / R** | C | C | C | I | I | C | I |
| **2. Read-Only Database / Replica Access** | I | I | I | **A** | **R** | R | I | C |
| **3. Ingestion & CDC Architecture** | I | I | I | **A** | C | **R** | I | C |
| **4. CFO Approval of Financial KPI Contracts** | I | **A / R** | I | I | C | R | I | I |
| **5. COO Approval of OEE & Production Metrics** | I | I | **A / R** | I | C | R | I | I |
| **6. Subledger-to-GL Reconciliation Verification** | I | **A** | I | I | C | **R** | I | I |
| **7. PII Masking & Security Threat Model** | I | C | I | C | I | C | I | **A / R** |
| **8. AI Model Selection (On-Premises vs Cloud)** | **A** | I | I | C | I | I | **R** | C |
| **9. Executive Q&A Benchmark Validation** | **A / R** | C | C | I | I | I | R | I |
| **10. Autonomous / Bounded Action Approval (Level 5+)**| **A** | C | C | C | C | I | R | C |
