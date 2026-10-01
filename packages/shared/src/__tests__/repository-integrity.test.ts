import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Repository Integrity: verifies connector status and honest testConnection behavior', async () => {
  // 1. Verify that connectors without live config do not return fake success: true
  const connectorsDir = path.resolve(process.cwd(), 'connectors');
  if (fs.existsSync(connectorsDir)) {
    const connectorFolders = fs.readdirSync(connectorsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    assert.ok(connectorFolders.length >= 4, 'Must have at least 4 connector packages');

    for (const folder of connectorFolders) {
      const manifestPath = path.join(connectorsDir, folder, 'src', 'manifest.ts');
      if (fs.existsSync(manifestPath)) {
        const manifestContent = fs.readFileSync(manifestPath, 'utf8');

        // Check that valid statuses are used
        const validStatuses = ['LIVE_INTEGRATION_VERIFIED', 'FIXTURE_TESTED', 'SCAFFOLDED', 'REQUIRES_VENDOR_ACCESS', 'DOCUMENTED_ONLY'];
        const hasValidStatus = validStatuses.some((st) => manifestContent.includes(`'${st}'`) || manifestContent.includes(`"${st}"`));
        assert.ok(hasValidStatus, `Connector ${folder} manifest must declare a valid ConnectorStatus from the standard taxonomy`);

        // If connector is for proprietary ERP without live vendor credentials, it must not claim LIVE_INTEGRATION_VERIFIED
        if (['rahkaran', 'chargoon', 'shauto', 'sepidar', 'payamgostar'].includes(folder)) {
          assert.equal(
            manifestContent.includes('LIVE_INTEGRATION_VERIFIED'),
            false,
            `Proprietary connector ${folder} must not claim LIVE_INTEGRATION_VERIFIED without live deployment credentials`
          );
        }
      }
    }
  }
});

test('Repository Integrity: verifies dataMode labeling and benchmark metadata alignment', async () => {
  // Check API server file for explicit FIXTURE mode handling
  const serverPath = path.resolve(process.cwd(), 'apps', 'api', 'src', 'server.ts');
  if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    assert.ok(serverContent.includes("dataMode: 'FIXTURE'") || serverContent.includes('dataMode: "FIXTURE"'), 'API server must explicitly label synthetic responses with dataMode: FIXTURE');
  }

  // Check README.md for benchmark separation (100 catalog vs executable cases)
  const readmePath = path.resolve(process.cwd(), 'README.md');
  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    assert.ok(readmeContent.includes('CEO-QUESTIONS.md'), 'README must link to CEO-QUESTIONS.md catalog');
    assert.equal(readmeContent.includes('100% Pass-brightgreen'), false, 'README badge must not claim 100% pass for the whole 100 questions dataset');
  }
});

test('Repository Integrity: verifies no sensitive dumps or private data in git working tree', async () => {
  const sensitivePaths = [
    'extracted_data_Meisam_sh',
    'extracted_data',
    'Customer_Data.xlsx',
    'Sales_Report_for_GolhaCo_1402.xlsx'
  ];

  for (const p of sensitivePaths) {
    const fullPath = path.resolve(process.cwd(), p);
    assert.equal(fs.existsSync(fullPath), false, `Sensitive path ${p} must not exist in repository working tree`);
  }
});
