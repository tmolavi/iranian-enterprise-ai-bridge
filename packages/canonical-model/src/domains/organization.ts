import { BaseCanonicalEntity } from '../base/metadata.js';

export interface Organization extends BaseCanonicalEntity {
  nameFa: string;
  nameEn?: string;
  nationalId?: string; // شناسه ملی
  registrationNumber?: string; // شماره ثبت
  economicCode?: string; // کد اقتصادی
  industry: string; // تولیدی، بازرگانی، خدماتی، هلدینگ، دولتی
  fiscalYearStartJalali: string; // e.g. "01/01"
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
