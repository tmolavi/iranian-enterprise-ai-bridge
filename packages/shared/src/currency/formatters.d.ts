/**
 * Currency, Scale, and Persian Number Formatting for Iranian Enterprise Metrics.
 * Handles Rials (ریال), Tomans (تومان), Million Tomans (میلیون تومان), Billion Tomans (میلیارد تومان),
 * and Hemmat (همت / هزار میلیارد تومان) widely used in Iranian executive reporting.
 */
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
export declare class IranianCurrencyFormatter {
    /**
     * Format numbers with thousands separators.
     */
    static formatNumber(val: number, decimals?: number, toPersian?: boolean): string;
    /**
     * Format monetary amount into executive friendly scale (همت، میلیارد تومان، میلیون تومان).
     * @param amountInRial The raw integer value in Iranian Rials (standard ERP ledger unit).
     */
    static formatExecutive(amountInRial: number, targetUnit?: CurrencyUnit): FormattedExecutiveAmount;
    /**
     * Format percentage value.
     */
    static formatPercent(ratio: number, decimals?: number, toPersian?: boolean): string;
}
//# sourceMappingURL=formatters.d.ts.map