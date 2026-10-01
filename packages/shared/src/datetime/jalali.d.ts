/**
 * High-precision Jalali (Solar Hijri / تقویم شمسی) date conversion and calendar math.
 * Zero external dependencies, supports standard Iranian ERP string and integer formats.
 */
export interface JalaliDate {
    jy: number;
    jm: number;
    jd: number;
}
export interface GregorianDate {
    gy: number;
    gm: number;
    gd: number;
}
export declare class JalaliDateTime {
    static readonly MONTH_NAMES_FA: string[];
    static readonly MONTH_NAMES_EN: string[];
    /**
     * Check if a Jalali year is leap year (سال کبیسه).
     */
    static isLeapJalaliYear(jy: number): boolean;
    /**
     * Internal algorithm for Jalali calendar breaks (33-year cycle algorithm).
     */
    private static jalaliCal;
    /**
     * Convert Gregorian date to Jalali date.
     */
    static toJalali(gy: number, gm: number, gd: number): JalaliDate;
    /**
     * Convert Jalali date to Gregorian date.
     */
    static toGregorian(jy: number, jm: number, jd: number): GregorianDate;
    /**
     * Format a JavaScript Date to standard Jalali string: YYYY/MM/DD
     */
    static format(date: Date, delimiter?: string): string;
    /**
     * Parse Jalali string (YYYY/MM/DD, YYYY-MM-DD, or YYYYMMDD) to JS Date.
     */
    static parse(jalaliStr: string): Date;
    /**
     * Return Jalali Quarter (1..4) and Fiscal Year for a date.
     */
    static getJalaliQuarter(date: Date): {
        year: number;
        quarter: number;
        quarterNameFa: string;
    };
}
//# sourceMappingURL=jalali.d.ts.map