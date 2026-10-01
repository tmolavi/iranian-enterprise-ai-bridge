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

export class Logger {
  private context: string;
  private minLevel: LogLevel;

  private static levelOrder: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor(context = 'IEAB', minLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info') {
    this.context = context;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    return Logger.levelOrder[level] >= Logger.levelOrder[this.minLevel];
  }

  private write(level: LogLevel, message: string, details?: Record<string, unknown>, err?: Error): void {
    if (!this.shouldLog(level)) return;

    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      details
    };

    if (err) {
      payload.error = {
        name: err.name,
        message: err.message,
        stack: err.stack
      };
    }

    if (process.env.NODE_ENV === 'production') {
      process.stdout.write(JSON.stringify(payload) + '\n');
    } else {
      const colors: Record<LogLevel, string> = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m'  // Red
      };
      const reset = '\x1b[0m';
      const color = colors[level];
      const timeStr = payload.timestamp.substring(11, 19);
      const detailStr = details ? ` ${JSON.stringify(details)}` : '';
      const errStr = err ? `\n${err.stack || err.message}` : '';

      process.stdout.write(
        `[${timeStr}] ${color}${level.toUpperCase()}${reset} [${this.context}]: ${message}${detailStr}${errStr}\n`
      );
    }
  }

  public debug(message: string, details?: Record<string, unknown>): void {
    this.write('debug', message, details);
  }

  public info(message: string, details?: Record<string, unknown>): void {
    this.write('info', message, details);
  }

  public warn(message: string, details?: Record<string, unknown>): void {
    this.write('warn', message, details);
  }

  public error(message: string, err?: Error | unknown, details?: Record<string, unknown>): void {
    const errorObj = err instanceof Error ? err : undefined;
    const extraDetails = err instanceof Error ? details : { ...details, rawError: err };
    this.write('error', message, extraDetails, errorObj);
  }
}
