"use strict";
/**
 * Currency, Scale, and Persian Number Formatting for Iranian Enterprise Metrics.
 * Handles Rials (ریال), Tomans (تومان), Million Tomans (میلیون تومان), Billion Tomans (میلیارد تومان),
 * and Hemmat (همت / هزار میلیارد تومان) widely used in Iranian executive reporting.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IranianCurrencyFormatter = void 0;
const persian_normalizer_js_1 = require("../text/persian-normalizer.js");
class IranianCurrencyFormatter {
    /**
     * Format numbers with thousands separators.
     */
    static formatNumber(val, decimals = 0, toPersian = false) {
        const parts = val.toFixed(decimals).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const formatted = parts.join('.');
        return toPersian ? persian_normalizer_js_1.PersianNormalizer.toPersianDigits(formatted) : formatted;
    }
    /**
     * Format monetary amount into executive friendly scale (همت، میلیارد تومان، میلیون تومان).
     * @param amountInRial The raw integer value in Iranian Rials (standard ERP ledger unit).
     */
    static formatExecutive(amountInRial, targetUnit = 'TOMAN') {
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
        }
        else if (absVal >= 1_000_000_000) {
            // Billion Toman (میلیارد تومان)
            scaledAmount = amountToman / 1_000_000_000;
            scaleLabelFa = 'میلیارد تومان';
            scaleLabelEn = 'Billion Toman';
        }
        else if (absVal >= 1_000_000) {
            // Million Toman (میلیون تومان)
            scaledAmount = amountToman / 1_000_000;
            scaleLabelFa = 'میلیون تومان';
            scaleLabelEn = 'Million Toman';
        }
        else if (absVal >= 1_000) {
            scaledAmount = amountToman / 1_000;
            scaleLabelFa = 'هزار تومان';
            scaleLabelEn = 'Thousand Toman';
        }
        const formattedScaledFa = persian_normalizer_js_1.PersianNormalizer.toPersianDigits(scaledAmount.toFixed(2));
        const formattedScaledEn = scaledAmount.toFixed(2);
        return {
            rawAmount: amountInRial,
            unit: targetUnit,
            formattedFa: `${persian_normalizer_js_1.PersianNormalizer.toPersianDigits(this.formatNumber(amountToman, 0))} تومان`,
            formattedEn: `${this.formatNumber(amountToman, 0)} Toman`,
            scaleLabelFa,
            scaleLabelEn,
            humanReadableFa: `${formattedScaledFa} ${scaleLabelFa}`
        };
    }
    /**
     * Format percentage value.
     */
    static formatPercent(ratio, decimals = 1, toPersian = true) {
        const pct = ratio * 100;
        const formatted = `${pct.toFixed(decimals)}%`;
        return toPersian ? `${persian_normalizer_js_1.PersianNormalizer.toPersianDigits(pct.toFixed(decimals))}٪` : formatted;
    }
}
exports.IranianCurrencyFormatter = IranianCurrencyFormatter;
//# sourceMappingURL=formatters.js.map