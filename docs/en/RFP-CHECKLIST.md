# ERP Buyer's Guide & RFP Master Checklist
## Dual Guide: "We Already Have an ERP" and "We Are Buying an ERP"

---

## Part 1: "We Already Bought an ERP" Path

If your organization has already deployed an ERP system: **Never replace your ERP merely to add AI capabilities.**

1. **Audit Active Modules:** Identify systems holding authoritative financial, inventory, and production data.
2. **Establish Safe Read Access:** Provision an AlwaysOn Read-Only Replica or a dedicated read-only database user.
3. **Deploy IEAB Generic MSSQL Connector:** Extract core invoices, parties, and cardex records.
4. **Formalize KPI Contracts with CFO:** Encode Net Sales, Gross Margin, and DSO formulas in `@ieab/semantic`.
5. **Reconcile Subledgers:** Verify that sales and inventory balances match general ledger control accounts.
6. **Activate CEO Copilot:** Launch the executive interface with initial strategic questions.

---

## Part 2: "We Are Buying an ERP" Master RFP Checklist

When evaluating ERP vendors, mandate these non-negotiable architectural requirements to prevent future data lock-in:

1. **Unconditional Data Ownership & Direct Read Access:** Explicit contractual rights to access read replicas without third-party integration penalties.
2. **Comprehensive Data Dictionary & Schema Documentation:** Up-to-date documentation of table structures, primary keys, and status code enumerations.
3. **Standard REST API & Webhooks:** High-performance REST endpoints for batch and event-driven data extraction without proprietary gateway middleware.
4. **SQL Server CDC / Change Tracking Compatibility:** Database schemas engineered to support Change Data Capture without performance degradation.
5. **Sandbox & Development Environments:** Access to staging databases with realistic schemas for continuous integration.
6. **Bulk Data Export & Portable Exit Rights:** Ability to export complete organizational history in standard open formats (CSV, JSON, Parquet).
7. **Architectural Subledger-to-GL Integrity:** Guaranteed reconciliation between inventory cardex, sales billing, and double-entry accounting ledgers.
