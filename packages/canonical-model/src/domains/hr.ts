import { BaseCanonicalEntity } from '../base/metadata.js';

export interface Employee extends BaseCanonicalEntity {
  personnelCode: string;
  nationalCode: string; // کد ملی
  fullNameFa: string;
  positionId?: string;
  departmentId?: string;
  costCenterId?: string;
  hireDateJalali: string;
  employmentType: 'PERMANENT' | 'CONTRACT' | 'PROJECT' | 'HOURLY';
  baseSalaryRial?: number; // Restricted / Masked
  isActive: boolean;
}

export interface Position extends BaseCanonicalEntity {
  code: string;
  titleFa: string;
  departmentId?: string;
  parentPositionId?: string;
}

export interface Attendance extends BaseCanonicalEntity {
  employeeId: string;
  dateJalali: string;
  presentMinutes: number;
  overtimeMinutes: number;
  delayMinutes: number;
  absenceMinutes: number;
  leaveMinutes: number;
}
