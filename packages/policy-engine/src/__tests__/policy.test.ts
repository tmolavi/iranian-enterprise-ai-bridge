import test from 'node:test';
import assert from 'node:assert/strict';
import { RBACPolicyEngine } from '../rbac/roles.js';
import { PIIMasker } from '../masking/pii-masker.js';
import { SQLSecurityGuard } from '../security/sql-guard.js';

test('RBACPolicyEngine: enforces permissions by role', () => {
  assert.equal(RBACPolicyEngine.hasPermission('CEO', 'EXEC_ASK_COPILOT'), true);
  assert.equal(RBACPolicyEngine.hasPermission('FINANCIAL_ANALYST', 'EXEC_ASK_COPILOT'), false);
  assert.equal(RBACPolicyEngine.canAccessMetric('CFO', 'FINANCE'), true);
  assert.equal(RBACPolicyEngine.canAccessMetric('COMMERCIAL_DIRECTOR', 'FINANCE'), false);
});

test('PIIMasker: masks Iranian national ID, IBAN, mobile and salary', () => {
  assert.equal(PIIMasker.maskNationalId('0071234567'), '007****567');
  assert.equal(PIIMasker.maskIBAN('IR120170000000123456789012'), 'IR12*************9012');
  assert.equal(PIIMasker.maskMobile('09123456789'), '0912***6789');

  const masked = PIIMasker.maskRecord({
    customerName: 'علی رضایی',
    nationalCode: '0071234567',
    bankIban: 'IR120170000000123456789012',
    phone: '09123456789',
    baseSalaryRial: 500000000
  });

  assert.equal(masked.nationalCode, '007****567');
  assert.equal(masked.bankIban, 'IR12*************9012');
  assert.equal(masked.phone, '0912***6789');
  assert.equal(masked.baseSalaryRial, '[MASKED_CONFIDENTIAL]');
});

test('SQLSecurityGuard: permits SELECT and blocks mutating statements', () => {
  assert.equal(SQLSecurityGuard.validateReadOnlySelect('SELECT * FROM vw_SalesInvoices WHERE Year = 1403'), true);
  assert.equal(SQLSecurityGuard.validateReadOnlySelect('WITH CTE AS (SELECT ID FROM Orders) SELECT * FROM CTE'), true);

  assert.throws(() => {
    SQLSecurityGuard.validateReadOnlySelect('UPDATE Invoices SET Status = 1');
  }, /Query must start with SELECT|Prohibited SQL keyword/);

  assert.throws(() => {
    SQLSecurityGuard.validateReadOnlySelect('DROP TABLE Customers');
  }, /Query must start with SELECT|Prohibited SQL keyword/);

  assert.throws(() => {
    SQLSecurityGuard.validateReadOnlySelect('EXEC sp_MSforeachtable');
  }, /Query must start with SELECT|Prohibited SQL keyword/);
});
