/**
 * Structured Logger for Iranian Enterprise AI Bridge.
 * Emits JSON logs in production and clean formatted console logs in development.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogPayload {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: string;
    orgId?: string;
    traceId?: string;
    details?: Record<string, unknown>;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}
export declare class Logger {
    private context;
    private minLevel;
    private static levelOrder;
    constructor(context?: string, minLevel?: LogLevel);
    private shouldLog;
    private write;
    debug(message: string, details?: Record<string, unknown>): void;
    info(message: string, details?: Record<string, unknown>): void;
    warn(message: string, details?: Record<string, unknown>): void;
    error(message: string, err?: Error | unknown, details?: Record<string, unknown>): void;
}
//# sourceMappingURL=index.d.ts.map