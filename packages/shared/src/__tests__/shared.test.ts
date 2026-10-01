import test from 'node:test';
import assert from 'node:assert/strict';
import { PersianNormalizer } from '../text/persian-normalizer.js';
import { JalaliDateTime } from '../datetime/jalali.js';
import { IranianCurrencyFormatter } from '../currency/formatters.js';

test('PersianNormalizer: unifies arabic characters, digits and removes diacritics', () => {
  const input = 'شركت بازرگاني كاوه‌فولاد با كد ملي ١٢٣٤٥٦٧٨٩٠ و سود ٪١٥';
  const normalized = PersianNormalizer.normalize(input);
  assert.equal(normalized.includes('ك'), false, 'Should replace Arabic Kaf with Persian Kaf');
  assert.equal(normalized.includes('ي'), false, 'Should replace Arabic Yeh with Persian Yeh');

  const latinDigits = PersianNormalizer.toLatinDigits(input);
  assert.ok(latinDigits.includes('1234567890'), 'Should convert arabic digits to latin digits');

  const persianDigits = PersianNormalizer.toPersianDigits('1403/07/15');
  assert.equal(persianDigits, '۱۴۰۳/۰۷/۱۵', 'Should convert latin digits to Persian digits');
});

test('JalaliDateTime: converts Gregorian and Jalali dates bidirectionally with precision', () => {
  // 2024-03-20 is 1403/01/01 (Nowruz)
  const gDate = new Date(Date.UTC(2024, 2, 20));
  const jStr = JalaliDateTime.format(gDate);
  assert.equal(jStr, '1403/01/01');

  // Parse back to Gregorian
  const parsed = JalaliDateTime.parse('1403/01/01');
  assert.equal(parsed.getUTCFullYear(), 2024);
  assert.equal(parsed.getUTCMonth(), 2); // March = index 2
  assert.equal(parsed.getUTCDate(), 20);

  // Check Quarter calculation
  const qInfo = JalaliDateTime.getJalaliQuarter(parsed);
  assert.equal(qInfo.year, 1403);
  assert.equal(qInfo.quarter, 1);
  assert.ok(qInfo.quarterNameFa.includes('بهار'));
});

test('IranianCurrencyFormatter: formats Rials to Tomans, Billion Tomans and Hemmat', () => {
  // 50 Billion Rials = 5 Billion Tomans (۵ میلیارد تومان)
  const rials = 50_000_000_000;
  const exec = IranianCurrencyFormatter.formatExecutive(rials, 'TOMAN');
  assert.equal(exec.unit, 'TOMAN');
  assert.ok(exec.humanReadableFa.includes('میلیارد تومان'));
  assert.ok(exec.humanReadableFa.includes('۵'));

  // 12.5 Trillion Rials = 1.25 Hemmat
  const largeRials = 12_500_000_000_000;
  const largeExec = IranianCurrencyFormatter.formatExecutive(largeRials, 'TOMAN');
  assert.ok(largeExec.scaleLabelFa.includes('هِمَت'));
});
