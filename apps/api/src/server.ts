import http from 'node:http';
import {
  ExecutiveCopilot,
  createMockEnterpriseDataSet
} from '@ieab/agent-runtime';
import { SemanticMetricRegistry } from '@ieab/semantic';
import {
  MetricCalculator,
  EnterpriseAnomalyDetector,
  CashForecaster,
  SubledgerReconciliationEngine
} from '@ieab/metrics';
import { EnterpriseAuditLedger } from '@ieab/audit';
import { GenericMSSQLConnector } from '@ieab/connector-generic-mssql';
import { RahkaranConnector } from '@ieab/connector-rahkaran';
import { ChargoonConnector } from '@ieab/connector-chargoon';
import { ShAutoConnector } from '@ieab/connector-shauto';
import { SepidarConnector } from '@ieab/connector-sepidar';
import { PayamGostarConnector } from '@ieab/connector-payamgostar';
import { OdooConnector } from '@ieab/connector-odoo';
import { CsvExcelConnector } from '@ieab/connector-csv-excel';
import { Logger, PersianNormalizer } from '@ieab/shared';

export class EnterpriseAPIServer {
  private server: http.Server;
  private logger = new Logger('APIServer');
  private copilot: ExecutiveCopilot;
  private registry: SemanticMetricRegistry;
  private calculator: MetricCalculator;
  private auditLedger: EnterpriseAuditLedger;
  private dataset = createMockEnterpriseDataSet();
  private connectors = [
    new GenericMSSQLConnector(),
    new RahkaranConnector(),
    new ChargoonConnector(),
    new ShAutoConnector(),
    new SepidarConnector(),
    new PayamGostarConnector(),
    new OdooConnector(),
    new CsvExcelConnector()
  ];

  constructor(port = 3000) {
    this.registry = new SemanticMetricRegistry();
    this.calculator = new MetricCalculator(this.registry);
    this.auditLedger = new EnterpriseAuditLedger();
    this.copilot = new ExecutiveCopilot(undefined, this.calculator, this.auditLedger);

    this.server = http.createServer(async (req, res) => {
      // Enable CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-User-Role, X-Org-ID');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const pathname = url.pathname;

      try {
        if (pathname === '/health' && req.method === 'GET') {
          this.jsonResponse(res, 200, {
            status: 'HEALTHY',
            product: 'Iranian Enterprise AI Bridge',
            version: '0.1.0',
            dataMode: 'FIXTURE',
            note: 'Running in FIXTURE mode with synthetic enterprise dataset. Live ERP connection requires configuring dedicated database connectors.',
            timestamp: new Date().toISOString()
          });
        } else if (pathname === '/api/v1/copilot/ask' && req.method === 'POST') {
          const body = await this.readJsonBody(req);
          const userContext = {
            userId: (req.headers['x-user-id'] as string) || 'usr-ceo-01',
            fullNameFa: (req.headers['x-user-name'] as string) || 'دکتر محمدی (مدیرعامل)',
            role: ((req.headers['x-user-role'] as string) || 'CEO') as any,
            orgId: (req.headers['x-org-id'] as string) || 'org-kaveh-01'
          };

          const promptFa = body.prompt || body.question || 'فروش این ماه چقدر است؟';
          const answer = await this.copilot.ask(userContext, promptFa, this.dataset);
          this.jsonResponse(res, 200, {
            ...answer,
            dataMode: 'FIXTURE'
          });
        } else if (pathname === '/api/v1/metrics' && req.method === 'GET') {
          const metrics = this.registry.getAll();
          this.jsonResponse(res, 200, { count: metrics.length, dataMode: 'FIXTURE', metrics });
        } else if (pathname.startsWith('/api/v1/metrics/') && pathname.endsWith('/calculate') && req.method === 'POST') {
          const parts = pathname.split('/');
          const metricId = parts[4];
          const body = await this.readJsonBody(req);
          const orgId = (req.headers['x-org-id'] as string) || body.orgId || 'org-kaveh-01';
          const result = this.calculator.calculate(metricId, this.dataset, { orgId });
          this.jsonResponse(res, 200, { ...result, dataMode: 'FIXTURE' });
        } else if (pathname === '/api/v1/anomalies' && req.method === 'GET') {
          const orgId = (req.headers['x-org-id'] as string) || 'org-kaveh-01';
          const anomalies = EnterpriseAnomalyDetector.detectAnomalies(orgId);
          this.jsonResponse(res, 200, { count: anomalies.length, dataMode: 'FIXTURE', anomalies });
        } else if (pathname === '/api/v1/forecast/cash' && req.method === 'GET') {
          const forecast = CashForecaster.forecast30Days(50_500_000_000);
          this.jsonResponse(res, 200, { ...forecast, dataMode: 'FIXTURE' });
        } else if (pathname === '/api/v1/connectors' && req.method === 'GET') {
          const manifests = this.connectors.map((c) => c.getManifest());
          this.jsonResponse(res, 200, { count: manifests.length, connectors: manifests });
        } else if (pathname === '/api/v1/audit/logs' && req.method === 'GET') {
          const orgId = (req.headers['x-org-id'] as string) || 'org-kaveh-01';
          const logs = this.auditLedger.getEvents(orgId);
          this.jsonResponse(res, 200, { count: logs.length, logs });
        } else if (pathname === '/api/v1/reconciliation/check' && req.method === 'POST') {
          const orgId = (req.headers['x-org-id'] as string) || 'org-kaveh-01';
          const report = SubledgerReconciliationEngine.reconcile(
            orgId,
            this.dataset.invoices,
            [],
            this.dataset.inventoryItems
          );
          this.jsonResponse(res, 200, report);
        } else {
          this.jsonResponse(res, 404, { error: 'Not Found', path: pathname });
        }
      } catch (err: any) {
        this.logger.error(`API Error: ${err.message}`, err);
        this.jsonResponse(res, err.statusCode || 500, {
          error: err.message,
          messageFa: err.messageFa || 'خطای غیرمنتظره در سرور رخ داده است.',
          code: err.code || 'INTERNAL_ERROR'
        });
      }
    });
  }

  private readJsonBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => (data += chunk));
      req.on('end', () => {
        if (!data) return resolve({});
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON payload'));
        }
      });
      req.on('error', reject);
    });
  }

  private jsonResponse(res: http.ServerResponse, statusCode: number, data: unknown): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data, null, 2));
  }

  public listen(port = 3000): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(port, () => {
        this.logger.info(`🏛️ Iranian Enterprise AI Bridge API listening on port ${port}`);
        resolve();
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve) => this.server.close(() => resolve()));
  }
}
