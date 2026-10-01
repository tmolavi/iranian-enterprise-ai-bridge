# Connectors SDK & Extraction Hierarchy Specification

## 1. Extraction Priority Hierarchy

When integrating any enterprise proprietary software, the connector MUST follow this strict extraction priority order:

1. **Official REST API** (Authenticated token-based gateway)
2. **Official Webhook / Event Stream** (Event-driven updates)
3. **Reporting API / OData Services** (Vendor reporting schemas)
4. **Read Replica** (AlwaysOn Availability Groups / streaming replicas)
5. **Change Data Capture** (SQL Server CDC / Change Tracking)
6. **Vendor-Supported Reporting Views**
7. **Read-Only Direct SQL** (`db_datareader` least-privilege user)
8. **Controlled File Drop** (Automated CSV / Excel exports)

---

## 2. Connector Definition of Done (DoD)

A connector is considered **COMPLETE** only if:
- [x] Manifest declares validated evidence level (`VF`, `VC`, `TP`, `PNF`)
- [x] `testConnection()` validates network latency and read-only intent
- [x] `discoverSchema()` inspects available tables, views, and fields
- [x] `extractIncremental()` recovers from cursor checkpoints seamlessly
- [x] `normalizeToCanonical()` transforms raw rows without dropping `sourcePk` lineage
- [x] Rate limiting protects target database from concurrency spikes
- [x] Full test coverage passes via `ConnectorTestHarness`
- [x] Comprehensive security notes and limitations are documented
