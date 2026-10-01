# Iranian Enterprise AI Bridge (IEAB)
### Open-Source Enterprise AI Integration Platform — Early Release (v0.1 — Functional Foundation)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript: Strict](https://img.shields.io/badge/TypeScript-5.7%20Strict-blue)](https://www.typescriptlang.org/)
[![Node: Current LTS](https://img.shields.io/badge/Node.js-20%2B%20LTS-green)](https://nodejs.org/)
[![Status: Early Release](https://img.shields.io/badge/Status-v0.1%20Early%20Release-orange)](IMPLEMENTATION_STATUS.md)
[![CEO Benchmark: 100 Questions](https://img.shields.io/badge/CEO%20Benchmark-100%20Questions%20Catalog-blue)](docs/en/CEO-QUESTIONS.md)

[مستندات فارسی (اصلی) → README.md](README.md) | [Audit & Real Implementation Status](IMPLEMENTATION_STATUS.md) | [Architecture Guide](docs/en/ARCHITECTURE.md) | [Organization & RACI Guide](docs/en/ORGANIZATION-GUIDE.md) | [14-Phase Playbook](docs/en/IMPLEMENTATION-PLAYBOOK.md) | [ERP Benchmark](docs/en/ERP-BENCHMARK.md)

---

## Why This Project Exists

In modern Iranian enterprise ecosystems, companies, industrial manufacturing plants, and holding groups sit on vast amounts of historical and operational data across proprietary ERPs (System Group / Rahkaran, Chargoon / Didgah, Shomaran / ShAuto, Sepidar), CRMs, BPMS, and Excel files. However, leadership and technical teams face a severe disconnect:

- **Enterprise leadership and CEOs** want instant, accurate strategic answers without learning SQL, BI cube hierarchies, or prompt engineering.
- **ERP specialists** understand underlying tables and transactional flows deeply, but are unfamiliar with modern LLM orchestration, agentic RAG, semantic layers, and local on-prem inference engines.
- **AI engineers** lack the domain understanding of Iranian financial compliance, double-entry ledgers, manufacturing costing (COGS), and Solar Hijri (Jalali) date systems, leading to catastrophic numerical hallucinations when naive Text-to-SQL is attempted.

**The Iranian Enterprise AI Bridge (IEAB)** bridges these distinct worlds. It is not an ERP replacement, nor does it replace the CFO, accountant, or BI engineer. Instead, it provides a governed, secure, and auditable pipeline connecting operational data to executive intelligence.

Released under the **MIT License** as an open-source public social impact initiative to empower manufacturing and enterprise productivity.

---

## Non-Negotiable Architecture Principle

**Never connect an LLM directly to a production ERP database with unrestricted Text-to-SQL generation.**

```
❌ Naive & Dangerous Architecture:
CEO ──> Query ──> LLM ──> Unrestricted SQL on Live Production ERP Database (High crash risk, lock escalation, hallucinated numbers)

✅ Governed Enterprise AI Bridge (IEAB):
Operational ERP / CRM (Rahkaran / Chargoon / ShAuto / Sepidar / MSSQL)
       ↓ (Read-Only Replica / CDC / Controlled Export)
Normalization & Canonical Enterprise Model (@ieab/canonical-model)
       ↓
Semantic Layer & KPI Metric Contracts (@ieab/semantic - Governed by CFO & COO)
       ↓
Deterministic Metric Calculator & Subledger-to-GL Reconciliation Engine (@ieab/metrics)
       ↓
AI Tool Gateway & Policy Engine (@ieab/policy-engine - RBAC & PII Masking)
       ↓
AI Large Language Model (Strictly used for intent parsing, tool routing, and synthesis)
       ↓
Executive Copilot Interface (@ieab/agent-runtime - Now, Exceptions, Why, Next, Ask)
```

Deterministic engines calculate authoritative numbers; AI understands intent, selects tools, and explains evidence.

---

## Monorepo Modules

- **`packages/shared`**: Persian/Arabic normalizer, high-precision Jalali date math with leap years, Iranian currency formatters (Toman, Billion Toman, Hemmat), and structured logging.
- **`packages/canonical-model`**: Vendor-independent schema for 11 enterprise domains (Organization, Party, Sales, Procurement, Inventory, Treasury, Accounting, Manufacturing, HR, Governance).
- **`packages/connector-sdk`**: Reusable connector SDK with rate limiting, cursor management, and test harnesses.
- **`packages/semantic`**: Semantic registry and KPI contracts with CFO/COO ownership.
- **`packages/metrics`**: Deterministic calculations (Gross/Net Sales, Cash Position, Receivables Aging, DSO, OEE, Scrap Rate, Machine Downtime), anomaly detection, cash forecasting, and subledger reconciliation.
- **`packages/policy-engine`**: Role-based access control (RBAC), PII data masking (National ID, IBAN, Phone, Salary), and SQL Security Guard.
- **`packages/audit`**: Immutable ledger recording queries, model calls, tools used, and source record references.
- **`packages/ai-gateway`**: Multi-provider gateway supporting local on-prem (vLLM / Ollama) and cloud models with prompt injection protection.
- **`packages/agent-runtime`**: Executive Copilot orchestration runtime with 100 Strategic CEO Questions benchmark.
- **`connectors/*`**: Standard connectors for Generic MSSQL, Rahkaran, Chargoon, ShAuto, Sepidar, PayamGostar, Odoo, and Excel/CSV drop.

---

## Quick Start

### 1. Installation
```bash
git clone https://github.com/tmolavi/iranian-enterprise-ai-bridge.git
cd iranian-enterprise-ai-bridge
npm install
```

### 2. Build & Test
```bash
npm run build
npm test
```

### 3. Run Executable Benchmark Cases
```bash
npm run benchmark
```
> Note: This command executes 10 representative test cases against the synthetic enterprise fixture dataset. The full 100-question strategic catalog is documented in [docs/en/CEO-QUESTIONS.md](docs/en/CEO-QUESTIONS.md).

### 4. Run Onboarding Wizard
```bash
npm run wizard
```

### 5. Start API Server & Executive Web UI
```bash
# Terminal 1: REST API (Port 3000)
npm run start:api

# Terminal 2: Executive Web Interface (Port 3001)
node apps/executive-web/server.js
```
Open `http://localhost:3001` in your browser.

---

## License
MIT License. Open for enterprise, commercial, and research use.
