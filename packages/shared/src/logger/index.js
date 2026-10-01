"use strict";
/**
 * Structured Logger for Iranian Enterprise AI Bridge.
 * Emits JSON logs in production and clean formatted console logs in development.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    context;
    minLevel;
    static levelOrder = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };
    constructor(context = 'IEAB', minLevel = process.env.LOG_LEVEL || 'info') {
        this.context = context;
        this.minLevel = minLevel;
    }
    shouldLog(level) {
        return Logger.levelOrder[level] >= Logger.levelOrder[this.minLevel];
    }
    write(level, message, details, err) {
        if (!this.shouldLog(level))
            return;
        const payload = {
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
        }
        else {
            const colors = {
                debug: '\x1b[36m', // Cyan
                info: '\x1b[32m', // Green
                warn: '\x1b[33m', // Yellow
                error: '\x1b[31m' // Red
            };
            const reset = '\x1b[0m';
            const color = colors[level];
            const timeStr = payload.timestamp.substring(11, 19);
            const detailStr = details ? ` ${JSON.stringify(details)}` : '';
            const errStr = err ? `\n${err.stack || err.message}` : '';
            process.stdout.write(`[${timeStr}] ${color}${level.toUpperCase()}${reset} [${this.context}]: ${message}${detailStr}${errStr}\n`);
        }
    }
    debug(message, details) {
        this.write('debug', message, details);
    }
    info(message, details) {
        this.write('info', message, details);
    }
    warn(message, details) {
        this.write('warn', message, details);
    }
    error(message, err, details) {
        const errorObj = err instanceof Error ? err : undefined;
        const extraDetails = err instanceof Error ? details : { ...details, rawError: err };
        this.write('error', message, extraDetails, errorObj);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=index.js.map