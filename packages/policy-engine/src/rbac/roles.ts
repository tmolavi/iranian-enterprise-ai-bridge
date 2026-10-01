/**
 * Enterprise Role-Based Access Control (RBAC) definitions.
 */

export type EnterpriseRole =
  | 'CEO'
  | 'CFO'
  | 'COO'
  | 'COMMERCIAL_DIRECTOR'
  | 'FACTORY_MANAGER'
  | 'ERP_ADMIN'
  | 'FINANCIAL_ANALYST'
  | 'AUDITOR';

export type EnterprisePermission =
  | 'EXEC_VIEW_FINANCIAL_KPIS'
  | 'EXEC_VIEW_TREASURY_CASH'
  | 'EXEC_VIEW_OPERATIONS_OEE'
  | 'EXEC_VIEW_SALES_COMMERCIAL'
  | 'EXEC_VIEW_HR_PAYROLL'
  | 'EXEC_ASK_COPILOT'
  | 'EXEC_VIEW_AUDIT_LOGS'
  | 'MANAGE_CONNECTORS'
  | 'APPROVE_METRIC_CONTRACT';

export const ROLE_PERMISSIONS: Record<EnterpriseRole, EnterprisePermission[]> = {
  CEO: [
    'EXEC_VIEW_FINANCIAL_KPIS',
    'EXEC_VIEW_TREASURY_CASH',
    'EXEC_VIEW_OPERATIONS_OEE',
    'EXEC_VIEW_SALES_COMMERCIAL',
    'EXEC_VIEW_HR_PAYROLL',
    'EXEC_ASK_COPILOT',
    'EXEC_VIEW_AUDIT_LOGS'
  ],
  CFO: [
    'EXEC_VIEW_FINANCIAL_KPIS',
    'EXEC_VIEW_TREASURY_CASH',
    'EXEC_VIEW_SALES_COMMERCIAL',
    'EXEC_ASK_COPILOT',
    'APPROVE_METRIC_CONTRACT'
  ],
  COO: [
    'EXEC_VIEW_OPERATIONS_OEE',
    'EXEC_VIEW_SALES_COMMERCIAL',
    'EXEC_ASK_COPILOT',
    'APPROVE_METRIC_CONTRACT'
  ],
  COMMERCIAL_DIRECTOR: [
    'EXEC_VIEW_SALES_COMMERCIAL',
    'EXEC_ASK_COPILOT'
  ],
  FACTORY_MANAGER: [
    'EXEC_VIEW_OPERATIONS_OEE',
    'EXEC_ASK_COPILOT'
  ],
  ERP_ADMIN: [
    'MANAGE_CONNECTORS',
    'EXEC_VIEW_AUDIT_LOGS'
  ],
  FINANCIAL_ANALYST: [
    'EXEC_VIEW_FINANCIAL_KPIS',
    'EXEC_VIEW_TREASURY_CASH'
  ],
  AUDITOR: [
    'EXEC_VIEW_AUDIT_LOGS',
    'EXEC_VIEW_FINANCIAL_KPIS'
  ]
};

export class RBACPolicyEngine {
  public static hasPermission(role: EnterpriseRole, permission: EnterprisePermission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  }

  public static canAccessMetric(role: EnterpriseRole, domain: string): boolean {
    if ((role as string) === 'CEO') return true;
    if (domain === 'HR' && (role as string) !== 'CEO') return false;
    if ((domain === 'FINANCE' || domain === 'TREASURY') && (role === 'CFO' || role === 'FINANCIAL_ANALYST')) return true;
    if ((domain === 'MANUFACTURING' || domain === 'MAINTENANCE' || domain === 'QUALITY') && (role === 'COO' || role === 'FACTORY_MANAGER')) return true;
    if (domain === 'SALES' && (role === 'COMMERCIAL_DIRECTOR' || role === 'CFO' || role === 'COO')) return true;
    return false;
  }
}
