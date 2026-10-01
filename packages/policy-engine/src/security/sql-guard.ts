import { PolicyViolationError } from '@ieab/shared';

export class SQLSecurityGuard {
  private static readonly DANGEROUS_PATTERNS = [
    /\b(UPDATE|INSERT|DELETE|DROP|ALTER|TRUNCATE|CREATE|MERGE|EXEC|EXECUTE)\b/i,
    /\b(GRANT|REVOKE|DENY|RECONFIGURE|SHUTDOWN)\b/i,
    /\b(XP_CMDSHELL|SP_EXECUTESQL|OPENROWSET|OPENDATASOURCE)\b/i,
    /--|\/\*|\*\//, // Comments that might be used for SQL injection evasion
    /;\s*(UPDATE|INSERT|DELETE|DROP|ALTER)/i // Stacked queries
  ];

  /**
   * Validate that a query is 100% SELECT-only and free of SQL injection / mutating commands.
   */
  public static validateReadOnlySelect(sql: string): boolean {
    const trimmed = sql.trim();

    if (!/^SELECT\b/i.test(trimmed) && !/^WITH\b/i.test(trimmed)) {
      throw new PolicyViolationError(
        'SQL_NOT_A_SELECT',
        'Query must start with SELECT or WITH statement.',
        'کوئری باید صرفاً با دستور SELECT یا WITH (خواندن داده) آغاز شود.'
      );
    }

    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        throw new PolicyViolationError(
          'SQL_MUTATION_OR_EXECUTION_BLOCKED',
          `Prohibited SQL keyword or pattern detected: ${pattern.source}`,
          'دستور ارسالی حاوی کلمات کلیدی غیرمجاز (تغییر داده، حذف یا اجرای پروسیجر) است و مسدود شد.'
        );
      }
    }

    return true;
  }
}
