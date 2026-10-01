/**
 * Persian & Arabic Text Normalization Utility for Iranian Enterprise Systems.
 * Standardizes Arabic kaf/yeh, digits, ZWNJ, and spacing commonly found in
 * Rahkaran, Chargoon, Shomaran, Sepidar, and MSSQL collations.
 */
export declare class PersianNormalizer {
    private static readonly ARABIC_YEH_REGEX;
    private static readonly PERSIAN_YEH;
    private static readonly ARABIC_KAF_REGEX;
    private static readonly PERSIAN_KAF;
    private static readonly ARABIC_HEH_REGEX;
    private static readonly PERSIAN_HEH;
    private static readonly PERSIAN_DIGITS;
    private static readonly ARABIC_DIGITS;
    /**
     * Normalize full Persian text (unifies letters, strips unnecessary diacritics, normalizes spaces).
     */
    static normalize(input?: string | null): string;
    /**
     * Convert Arabic and Persian digits to Latin digits (0-9).
     */
    static toLatinDigits(input?: string | null): string;
    /**
     * Convert Latin digits to Persian digits (۰-۹).
     */
    static toPersianDigits(input?: string | number | null): string;
    /**
     * Sanitize an entity or column name for safe SQL & JSON queries.
     */
    static cleanKey(input: string): string;
}
//# sourceMappingURL=persian-normalizer.d.ts.map