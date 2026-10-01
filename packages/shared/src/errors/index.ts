/**
 * Standard Error Hierarchy for Iranian Enterprise AI Bridge.
 */

export type ErrorSeverity = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly details?: Record<string, unknown>;
  public readonly messageFa: string;

  constructor(options: {
    code: string;
    messageEn: string;
    messageFa: string;
    statusCode?: number;
    severity?: ErrorSeverity;
    details?: Record<string, unknown>;
  }) {
    super(options.messageEn);
    this.name = this.constructor.name;
    this.code = options.code;
    this.messageFa = options.messageFa;
    this.statusCode = options.statusCode || 500;
    this.severity = options.severity || 'ERROR';
    this.details = options.details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConnectorError extends AppError {
  constructor(code: string, messageEn: string, messageFa: string, details?: Record<string, unknown>) {
    super({
      code: `CONNECTOR_${code}`,
      messageEn,
      messageFa,
      statusCode: 502,
      severity: 'ERROR',
      details
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(messageEn = 'Unauthorized access', messageFa = 'عدم احراز هویت یا دسترسی نامعتبر') {
    super({
      code: 'AUTH_UNAUTHORIZED',
      messageEn,
      messageFa,
      statusCode: 401,
      severity: 'WARN'
    });
  }
}

export class PolicyViolationError extends AppError {
  constructor(policyName: string, messageEn: string, messageFa: string, details?: Record<string, unknown>) {
    super({
      code: `POLICY_VIOLATION_${policyName.toUpperCase()}`,
      messageEn,
      messageFa,
      statusCode: 403,
      severity: 'WARN',
      details
    });
  }
}

export class SemanticMetricError extends AppError {
  constructor(metricId: string, messageEn: string, messageFa: string, details?: Record<string, unknown>) {
    super({
      code: `METRIC_ERROR_${metricId.toUpperCase()}`,
      messageEn,
      messageFa,
      statusCode: 400,
      severity: 'WARN',
      details
    });
  }
}

export class ReconciliationError extends AppError {
  constructor(metricId: string, diffAmount: number, messageEn: string, messageFa: string) {
    super({
      code: `RECONCILIATION_FAILED_${metricId.toUpperCase()}`,
      messageEn,
      messageFa,
      statusCode: 422,
      severity: 'CRITICAL',
      details: { metricId, diffAmount }
    });
  }
}
