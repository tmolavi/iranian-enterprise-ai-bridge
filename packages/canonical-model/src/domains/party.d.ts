import { BaseCanonicalEntity } from '../base/metadata.js';
export type PartyType = 'INDIVIDUAL' | 'LEGAL_ENTITY';
export interface Customer extends BaseCanonicalEntity {
    code: string;
    nameFa: string;
    nameEn?: string;
    partyType: PartyType;
    nationalId?: string;
    economicCode?: string;
    category?: string;
    province?: string;
    city?: string;
    address?: string;
    phone?: string;
    creditLimitRial?: number;
    paymentTermDays?: number;
    salesRepresentativeId?: string;
    isActive: boolean;
}
export interface Supplier extends BaseCanonicalEntity {
    code: string;
    nameFa: string;
    nameEn?: string;
    partyType: PartyType;
    nationalId?: string;
    economicCode?: string;
    category?: string;
    rating?: number;
    isActive: boolean;
}
export interface Contact extends BaseCanonicalEntity {
    customerId?: string;
    supplierId?: string;
    fullNameFa: string;
    positionFa?: string;
    mobile?: string;
    email?: string;
}
//# sourceMappingURL=party.d.ts.map