/**
 * Enterprise PII & Sensitive Data Masking for Iranian Organizations.
 * Protects National Code (کدملی), IBAN (شبا), Mobile Numbers and Salary.
 */

export class PIIMasker {
  /**
   * Mask Iranian National ID: '0071234567' -> '007****567'
   */
  public static maskNationalId(nationalId?: string | null): string {
    if (!nationalId) return '';
    const clean = nationalId.trim();
    if (clean.length === 10) {
      return `${clean.substring(0, 3)}****${clean.substring(7)}`;
    }
    return '****';
  }

  /**
   * Mask Iranian IBAN (شبا): 'IR120170000000123456789012' -> 'IR12*************9012'
   */
  public static maskIBAN(iban?: string | null): string {
    if (!iban) return '';
    const clean = iban.trim();
    if (clean.length >= 10) {
      return `${clean.substring(0, 4)}*************${clean.substring(clean.length - 4)}`;
    }
    return 'IR********************';
  }

  /**
   * Mask Iranian Mobile: '09123456789' -> '0912***6789'
   */
  public static maskMobile(mobile?: string | null): string {
    if (!mobile) return '';
    const clean = mobile.trim();
    if (clean.length === 11) {
      return `${clean.substring(0, 4)}***${clean.substring(7)}`;
    }
    return '09*********';
  }

  /**
   * Recursively mask sensitive fields in objects/arrays before sending to AI or UI logs.
   */
  public static maskRecord<T extends Record<string, any>>(record: T): T {
    const masked: Record<string, any> = { ...record };

    for (const key of Object.keys(masked)) {
      const lowerKey = key.toLowerCase();
      const val = masked[key];

      if (typeof val === 'string') {
        if (lowerKey.includes('nationalid') || lowerKey.includes('nationalcode') || lowerKey.includes('codemelli')) {
          masked[key] = this.maskNationalId(val);
        } else if (lowerKey.includes('iban') || lowerKey.includes('sheba') || lowerKey.includes('shaba')) {
          masked[key] = this.maskIBAN(val);
        } else if (lowerKey.includes('mobile') || lowerKey.includes('phone') || lowerKey.includes('cell')) {
          masked[key] = this.maskMobile(val);
        }
      } else if (typeof val === 'number') {
        if (lowerKey.includes('salary') || lowerKey.includes('wage') || lowerKey.includes('dastmozd')) {
          masked[key] = '[MASKED_CONFIDENTIAL]';
        }
      } else if (val && typeof val === 'object' && !Array.isArray(val)) {
        masked[key] = this.maskRecord(val);
      }
    }

    return masked as T;
  }
}
