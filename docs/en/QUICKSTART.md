# Quick Start Guide

## 1. Prerequisites
- Node.js 20+ LTS
- PostgreSQL 16+ (or Docker)
- Read-only network access to your enterprise database or read replica

---

## 2. 5-Minute Setup

```bash
# 1. Clone the repository
git clone https://github.com/iranian-enterprise-ai-bridge/ieab.git
cd ieab

# 2. Install workspace dependencies
npm install

# 3. Build packages and run unit tests
npm run build
npm test

# 4. Run the 100 Strategic CEO Benchmark suite
npm run benchmark

# 5. Run the Organization Onboarding Wizard
npm run wizard

# 6. Start the REST API server
npm run start:api
```

Launch the Executive Web Interface:
```bash
node apps/executive-web/server.js
```
Navigate to `http://localhost:3001` in your browser.
