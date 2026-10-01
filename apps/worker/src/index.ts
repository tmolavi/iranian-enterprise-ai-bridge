import { Logger } from '@ieab/shared';
import { GenericMSSQLConnector } from '@ieab/connector-generic-mssql';
import { EnterpriseAnomalyDetector } from '@ieab/metrics';

const logger = new Logger('SyncWorker');

async function runScheduledJobs(): Promise<void> {
  logger.info('⚙️ Worker started: Running background ERP sync and anomaly detector...');

  const mssqlConnector = new GenericMSSQLConnector();
  const health = await mssqlConnector.healthCheck();
  logger.info(`Connector Health: ${health.statusMessageFa}`);

  // Anomaly check
  const anomalies = EnterpriseAnomalyDetector.detectAnomalies('org-kaveh-01');
  logger.info(`Anomaly Scan Completed: ${anomalies.length} business exceptions detected.`);
}

runScheduledJobs().catch((err) => {
  logger.error('Worker failed', err);
});
