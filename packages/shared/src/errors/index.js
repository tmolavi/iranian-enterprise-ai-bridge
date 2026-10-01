"use strict";
/**
 * Standard Error Hierarchy for Iranian Enterprise AI Bridge.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationError = exports.SemanticMetricError = exports.PolicyViolationError = exports.AuthenticationError = exports.ConnectorError = exports.AppError = void 0;
class AppError extends Error {
    code;
    statusCode;
    severity;
    details;
    messageFa;
    constructor(options) {
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
exports.AppError = AppError;
class ConnectorError extends AppError {
    constructor(code, messageEn, messageFa, details) {
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
exports.ConnectorError = ConnectorError;
class AuthenticationError extends AppError {
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
exports.AuthenticationError = AuthenticationError;
class PolicyViolationError extends AppError {
    constructor(policyName, messageEn, messageFa, details) {
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
exports.PolicyViolationError = PolicyViolationError;
class SemanticMetricError extends AppError {
    constructor(metricId, messageEn, messageFa, details) {
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
exports.SemanticMetricError = SemanticMetricError;
class ReconciliationError extends AppError {
    constructor(metricId, diffAmount, messageEn, messageFa) {
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
exports.ReconciliationError = ReconciliationError;
//# sourceMappingURL=index.js.map