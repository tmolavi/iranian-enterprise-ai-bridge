import { BaseCanonicalEntity } from '../base/metadata.js';
export type ContractType = 'SALES' | 'PURCHASE' | 'EMPLOYMENT' | 'SUBCONTRACTING' | 'CONSULTING' | 'NDA';
export interface Contract extends BaseCanonicalEntity {
    contractNumber: string;
    titleFa: string;
    contractType: ContractType;
    counterpartPartyType: 'CUSTOMER' | 'SUPPLIER' | 'EMPLOYEE' | 'PARTNER';
    counterpartPartyId: string;
    counterpartNameFa: string;
    totalValueRial: number;
    startDateJalali: string;
    endDateJalali: string;
    status: 'DRAFT' | 'LEGAL_REVIEW' | 'SIGNED' | 'ACTIVE' | 'FULFILLED' | 'TERMINATED' | 'EXPIRED';
    guaranteeAmountRial?: number;
    guaranteeType?: 'BANK_GUARANTEE' | 'CHEQUE' | 'PROMISSORY_NOTE';
    notesFa?: string;
}
export interface Document extends BaseCanonicalEntity {
    documentNumber: string;
    titleFa: string;
    category: 'REGULATION' | 'DIRECTIVE' | 'BOARD_RESOLUTION' | 'AUDIT_REPORT' | 'TECHNICAL_MANUAL';
    issueDateJalali: string;
    authorDepartmentId?: string;
    confidentialityLevel: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'STRICTLY_CONFIDENTIAL';
    summaryFa: string;
    fullTextFa?: string;
    fileUri?: string;
}
export interface Meeting extends BaseCanonicalEntity {
    meetingNumber: string;
    titleFa: string;
    meetingDateJalali: string;
    attendeesFa: string[];
    summaryFa: string;
    decisions: Decision[];
}
export interface Decision extends BaseCanonicalEntity {
    meetingId?: string;
    decisionNumber: string;
    titleFa: string;
    descriptionFa: string;
    status: 'APPROVED' | 'REJECTED' | 'IN_EXECUTION' | 'ACCOMPLISHED';
    actionItems: ActionItem[];
}
export interface ActionItem extends BaseCanonicalEntity {
    decisionId?: string;
    titleFa: string;
    assigneeEmployeeId: string;
    assigneeNameFa: string;
    dueDateJalali: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'OVERDUE' | 'CANCELLED';
    completionDateJalali?: string;
}
//# sourceMappingURL=governance.d.ts.map