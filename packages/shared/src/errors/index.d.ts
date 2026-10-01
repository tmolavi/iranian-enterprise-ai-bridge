/**
 * Standard Error Hierarchy for Iranian Enterprise AI Bridge.
 */
export type ErrorSeverity = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
export declare class AppError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly severity: ErrorSeverity;
    readonly details?: Record<string, unknown>;
    readonly messageFa: string;
    constructor(options: {
        code: string;
        messageEn: string;
        messageFa: string;
        statusCode?: number;
        severity?: ErrorSeverity;
        details?: Record<string, unknown>;
    });
}
export declare class ConnectorError extends AppError {
    constructor(code: string, messageEn: string, messageFa: string, details?: Record<string, unknown>);
}
export declare class AuthenticationError extends AppError {
    constructor(messageEn?: string, messageFa?: string);
}
export declare class PolicyViolationError extends AppError {
    constructor(policyName: string, messageEn: string, messageFa: string, details?: Record<string, unknown>);
}
export declare class SemanticMetricError extends AppError {
    constructor(metricId: string, messageEn: string, messageFa: string, details?: Record<string, unknown>);
}
export declare class ReconciliationError extends AppError {
    constructor(metricId: string, diffAmount: number, messageEn: string, messageFa: string);
}
//# sourceMappingURL=index.d.ts.map