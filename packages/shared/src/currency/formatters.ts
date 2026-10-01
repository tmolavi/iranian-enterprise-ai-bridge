/**
 * Currency, Scale, and Persian Number Formatting for Iranian Enterprise Metrics.
 * Handles Rials (ریال), Tomans (تومان), Million Tomans (میلیون تومان), Billion Tomans (میلیارد تومان),
 * and Hemmat (همت / هزار میلیارد تومان) widely used in Iranian executive reporting.
 */

import { PersianNormalizer } from '../text/persian-normalizer.js';

export type CurrencyUnit = 'RIAL' | 'TOMAN';

export interface FormattedExecutiveAmount {
  rawAmount: number;
  unit: CurrencyUnit;
  formattedFa: string;
  formattedEn: string;
  scaleLabelFa: string;
  scaleLabelEn: string;
  humanReadableFa: string;
}

export class IranianCurrencyFormatter {
  /**
   * Format numbers with thousands separators.
   */
  public static formatNumber(val: number, decimals = 0, toPersian = false): string {
    const parts = val.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formatted = parts.join('.');
    return toPersian ? PersianNormalizer.toPersianDigits(formatted) : formatted;
  }

  /**
   * Format monetary amount into executive friendly scale (همت، میلیارد تومان، میلیون تومان).
   * @param amountInRial The raw integer value in Iranian Rials (standard ERP ledger unit).
   */
  public static formatExecutive(amountInRial: number, targetUnit: CurrencyUnit = 'TOMAN'): FormattedExecutiveAmount {
    const amountToman = targetUnit === 'TOMAN' ? amountInRial / 10 : amountInRial;
    const absVal = Math.abs(amountToman);

    let scaleLabelFa = 'تومان';
    let scaleLabelEn = 'Toman';
    let scaledAmount = amountToman;

    if (absVal >= 1_000_000_000_000) {
      // Hemmat (هزار میلیارد تومان / همت)
      scaledAmount = amountToman / 1_000_000_000_000;
      scaleLabelFa = 'هِمَت (هزار میلیارد تومان)';
      scaleLabelEn = 'Trillion Toman (Hemmat)';
    } else if (absVal >= 1_000_000_000) {
      // Billion Toman (میلیارد تومان)
      scaledAmount = amountToman / 1_000_000_000;
      scaleLabelFa = 'میلیارد تومان';
      scaleLabelEn = 'Billion Toman';
    } else if (absVal >= 1_000_000) {
      // Million Toman (میلیون تومان)
      scaledAmount = amountToman / 1_000_000;
      scaleLabelFa = 'میلیون تومان';
      scaleLabelEn = 'Million Toman';
    } else if (absVal >= 1_000) {
      scaledAmount = amountToman / 1_000;
      scaleLabelFa = 'هزار تومان';
      scaleLabelEn = 'Thousand Toman';
    }

    const formattedScaledFa = PersianNormalizer.toPersianDigits(scaledAmount.toFixed(2));
    const formattedScaledEn = scaledAmount.toFixed(2);

    return {
      rawAmount: amountInRial,
      unit: targetUnit,
      formattedFa: `${PersianNormalizer.toPersianDigits(this.formatNumber(amountToman, 0))} تومان`,
      formattedEn: `${this.formatNumber(amountToman, 0)} Toman`,
      scaleLabelFa,
      scaleLabelEn,
      humanReadableFa: `${formattedScaledFa} ${scaleLabelFa}`
    };
  }

  /**
   * Format percentage value.
   */
  public static formatPercent(ratio: number, decimals = 1, toPersian = true): string {
    const pct = ratio * 100;
    const formatted = `${pct.toFixed(decimals)}%`;
    return toPersian ? `${PersianNormalizer.toPersianDigits(pct.toFixed(decimals))}٪` : formatted;
  }
}
