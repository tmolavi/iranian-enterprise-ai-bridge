import { BaseCanonicalEntity } from '../base/metadata.js';
export interface BOMItem {
    rawMaterialProductId: string;
    quantityRequired: number;
    wastePercentage: number;
}
export interface BOM extends BaseCanonicalEntity {
    bomCode: string;
    finishedGoodsProductId: string;
    version: string;
    batchSize: number;
    isActive: boolean;
    items: BOMItem[];
}
export interface ProductionOrder extends BaseCanonicalEntity {
    orderNumber: string;
    productId: string;
    bomId?: string;
    workCenterId?: string;
    plannedQuantity: number;
    producedQuantity: number;
    rejectedQuantity: number;
    startDateJalali: string;
    endDateJalali?: string;
    status: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    costCenterId?: string;
}
export interface MaterialConsumption extends BaseCanonicalEntity {
    consumptionDocumentNumber: string;
    productionOrderId: string;
    consumptionDateJalali: string;
    rawMaterialProductId: string;
    plannedQty: number;
    actualQty: number;
    varianceQty: number;
    totalCostRial: number;
}
export interface Machine extends BaseCanonicalEntity {
    machineCode: string;
    titleFa: string;
    workCenterId: string;
    brandModel?: string;
    installationYearJalali?: number;
    status: 'RUNNING' | 'STOPPED' | 'MAINTENANCE' | 'DECOMMISSIONED';
}
export interface WorkCenter extends BaseCanonicalEntity {
    code: string;
    titleFa: string;
    departmentId?: string;
    capacityHoursPerDay: number;
    shiftsCount: number;
}
export type DowntimeCategory = 'BREAKDOWN' | 'SETUP' | 'SHORTAGE' | 'POWER_OUTAGE' | 'OPERATOR_ABSENCE' | 'OTHER';
export interface Downtime extends BaseCanonicalEntity {
    machineId: string;
    downtimeCategory: DowntimeCategory;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    reasonFa: string;
    productionOrderId?: string;
    isPlanned: boolean;
}
export interface QualityInspection extends BaseCanonicalEntity {
    inspectionNumber: string;
    inspectionType: 'INCOMING' | 'IN_PROCESS' | 'FINAL';
    productId: string;
    productionOrderId?: string;
    inspectedQty: number;
    acceptedQty: number;
    rejectedQty: number;
    reworkQty: number;
    defectReasonFa?: string;
    inspectorEmployeeId?: string;
}
export interface Waste extends BaseCanonicalEntity {
    wasteDocumentNumber: string;
    productionOrderId?: string;
    productId: string;
    wasteQty: number;
    wasteType: 'NORMAL' | 'ABNORMAL';
    costImpactRial: number;
    reasonFa: string;
}
//# sourceMappingURL=manufacturing.d.ts.map