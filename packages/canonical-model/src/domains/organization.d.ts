import { BaseCanonicalEntity } from '../base/metadata.js';
export interface Organization extends BaseCanonicalEntity {
    nameFa: string;
    nameEn?: string;
    nationalId?: string;
    registrationNumber?: string;
    economicCode?: string;
    industry: string;
    fiscalYearStartJalali: string;
    baseCurrency: 'RIAL' | 'TOMAN';
}
export interface LegalEntity extends BaseCanonicalEntity {
    nameFa: string;
    nameEn?: string;
    nationalId: string;
    economicCode?: string;
    isParent: boolean;
    parentEntityId?: string;
}
export interface BusinessUnit extends BaseCanonicalEntity {
    code: string;
    titleFa: string;
    titleEn?: string;
    legalEntityId: string;
    headEmployeeId?: string;
}
export interface CostCenter extends BaseCanonicalEntity {
    code: string;
    titleFa: string;
    titleEn?: string;
    parentCostCenterId?: string;
    departmentId?: string;
    isActive: boolean;
}
export interface Project extends BaseCanonicalEntity {
    code: string;
    titleFa: string;
    titleEn?: string;
    costCenterId?: string;
    status: 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
    startDateJalali?: string;
    endDateJalali?: string;
    budgetRial?: number;
}
//# sourceMappingURL=organization.d.ts.map