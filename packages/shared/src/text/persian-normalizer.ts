/**
 * Persian & Arabic Text Normalization Utility for Iranian Enterprise Systems.
 * Standardizes Arabic kaf/yeh, digits, ZWNJ, and spacing commonly found in
 * Rahkaran, Chargoon, Shomaran, Sepidar, and MSSQL collations.
 */

export class PersianNormalizer {
  private static readonly ARABIC_YEH_REGEX = /[\u064A\u0649\u06D2\u06D3]/g; // ي, ى, etc.
  private static readonly PERSIAN_YEH = '\u06CC'; // ی

  private static readonly ARABIC_KAF_REGEX = /[\u0643\u06AA]/g; // ك
  private static readonly PERSIAN_KAF = '\u06A9'; // ک

  private static readonly ARABIC_HEH_REGEX = /[\u0629]/g; // ة -> ه
  private static readonly PERSIAN_HEH = '\u0647'; // ه

  private static readonly PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  private static readonly ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  /**
   * Normalize full Persian text (unifies letters, strips unnecessary diacritics, normalizes spaces).
   */
  public static normalize(input?: string | null): string {
    if (!input) return '';

    let text = input;

    // 1. Unify Yeh & Kaf & Heh
    text = text.replace(this.ARABIC_YEH_REGEX, this.PERSIAN_YEH);
    text = text.replace(this.ARABIC_KAF_REGEX, this.PERSIAN_KAF);
    text = text.replace(this.ARABIC_HEH_REGEX, this.PERSIAN_HEH);

    // 2. Remove Arabic Tashkeel / Harakat (Tanwin, Sukun, Fatha, etc.)
    text = text.replace(/[\u064B-\u065F\u0670]/g, '');

    // 3. Normalize ZWNJ (Zero Width Non-Joiner \u200C)
    // Collapse duplicate ZWNJs and whitespace around ZWNJ
    text = text.replace(/\u200c{2,}/g, '\u200c');
    text = text.replace(/\s*\u200c\s*/g, '\u200c');

    // 4. Normalize multiple spaces
    text = text.replace(/[ \t\f\v]+/g, ' ');

    return text.trim();
  }

  /**
   * Convert Arabic and Persian digits to Latin digits (0-9).
   */
  public static toLatinDigits(input?: string | null): string {
    if (!input) return '';
    let res = input;

    // Replace Persian digits
    for (let i = 0; i < 10; i++) {
      res = res.replace(new RegExp(this.PERSIAN_DIGITS[i], 'g'), i.toString());
      res = res.replace(new RegExp(this.ARABIC_DIGITS[i], 'g'), i.toString());
    }

    return res;
  }

  /**
   * Convert Latin digits to Persian digits (۰-۹).
   */
  public static toPersianDigits(input?: string | number | null): string {
    if (input === null || input === undefined) return '';
    const str = input.toString();
    return str.replace(/\d/g, (d) => this.PERSIAN_DIGITS[parseInt(d, 10)]);
  }

  /**
   * Sanitize an entity or column name for safe SQL & JSON queries.
   */
  public static cleanKey(input: string): string {
    return this.normalize(input)
      .toLowerCase()
      .replace(/[\s\-_]+/g, '_')
      .replace(/[^\w\u0600-\u06FF]/g, '');
  }
}
