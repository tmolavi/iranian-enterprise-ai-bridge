import { ExecutiveInteractionAuditEvent } from '../types/audit-event.js';
import { Logger } from '@ieab/shared';

export class EnterpriseAuditLedger {
  private events: ExecutiveInteractionAuditEvent[] = [];
  private logger = new Logger('AuditLedger');

  public logEvent(event: ExecutiveInteractionAuditEvent): void {
    this.events.push(event);
    this.logger.info(`Audit logged for [${event.userRole}] ${event.userFullNameFa}: "${event.promptFa.substring(0, 40)}..."`, {
      eventId: event.id,
      orgId: event.orgId,
      toolsCount: event.toolCalls.length,
      metricsCount: event.metricsQueried.length
    });
  }

  public getEvents(orgId: string, limit = 50): ExecutiveInteractionAuditEvent[] {
    return this.events
      .filter((e) => e.orgId === orgId)
      .slice(-limit)
      .reverse();
  }

  public getEventById(eventId: string): ExecutiveInteractionAuditEvent | undefined {
    return this.events.find((e) => e.id === eventId);
  }
}
