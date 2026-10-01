import { MetricDefinition, MetricDomain } from '../types/metric-definition.js';
import { STANDARD_METRICS } from '../definitions/standard-metrics.js';
import { SemanticMetricError } from '@ieab/shared';

export class SemanticMetricRegistry {
  private metrics: Map<string, MetricDefinition> = new Map();

  constructor(initialMetrics: MetricDefinition[] = STANDARD_METRICS) {
    for (const metric of initialMetrics) {
      this.register(metric);
    }
  }

  public register(metric: MetricDefinition): void {
    this.metrics.set(metric.id.toUpperCase(), metric);
  }

  public get(metricId: string): MetricDefinition {
    const found = this.metrics.get(metricId.toUpperCase());
    if (!found) {
      throw new SemanticMetricError(
        metricId,
        `Metric definition '${metricId}' is not registered in semantic layer.`,
        `شاخص '${metricId}' در لایه معنایی سیستم تعریف یا مصوب نشده است.`
      );
    }
    return found;
  }

  public getAll(): MetricDefinition[] {
    return Array.from(this.metrics.values());
  }

  public getByDomain(domain: MetricDomain): MetricDefinition[] {
    return this.getAll().filter((m) => m.domain === domain);
  }

  public search(query: string): MetricDefinition[] {
    const q = query.toLowerCase();
    return this.getAll().filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.titleFa.toLowerCase().includes(q) ||
        m.titleEn.toLowerCase().includes(q) ||
        m.descriptionFa.toLowerCase().includes(q)
    );
  }
}
