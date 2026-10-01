import test from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveCopilot } from '../runtime/executive-copilot.js';
import { createMockEnterpriseDataSet } from '../benchmark/benchmark-runner.js';

test('ExecutiveCopilot: answers CEO question with deterministic evidence and zero hallucination', async () => {
  const copilot = new ExecutiveCopilot();
  const dataset = createMockEnterpriseDataSet();
  const userCtx = {
    userId: 'usr-ceo-01',
    fullNameFa: 'دکتر محمدی (مدیرعامل)',
    role: 'CEO' as const,
    orgId: 'org-kaveh-01'
  };

  const answer = await copilot.ask(userCtx, 'فروش این ماه چرا کم شده است؟', dataset);

  assert.ok(answer.executiveSummaryFa.includes('فروش خالص') || answer.executiveSummaryFa.includes('فروش ناخالص'));
  assert.equal(answer.reconciled, true);
  assert.equal(answer.evidence.reconciliationStatus, 'RECONCILED');
  assert.equal(answer.evidence.sourceSystem, 'RAHKARAN_MSSQL');
  assert.ok(answer.keyDriversFa.length > 0);
  assert.ok(answer.recommendedActionsFa.length > 0);
  assert.ok(answer.executionDurationMs < 500);
});

test('ExecutiveCopilot: blocks unauthorized non-executive user roles', async () => {
  const copilot = new ExecutiveCopilot();
  const dataset = createMockEnterpriseDataSet();
  const unauthorizedCtx = {
    userId: 'usr-staff-01',
    fullNameFa: 'کارشناس اداری',
    role: 'FINANCIAL_ANALYST' as const,
    orgId: 'org-kaveh-01'
  };

  await assert.rejects(async () => {
    await copilot.ask(unauthorizedCtx, 'فروش این ماه چقدر است؟', dataset);
  }, /not permitted to use Executive Copilot|مجاز به استفاده/);
});
