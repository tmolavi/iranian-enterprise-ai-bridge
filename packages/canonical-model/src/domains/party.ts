import { BaseCanonicalEntity } from '../base/metadata.js';

export type PartyType = 'INDIVIDUAL' | 'LEGAL_ENTITY'; // حقیقی یا حقوقی

export interface Customer extends BaseCanonicalEntity {
  code: string;
  nameFa: string;
  nameEn?: string;
  partyType: PartyType;
  nationalId?: string; // کد ملی یا شناسه ملی
  economicCode?: string; // کد اقتصادی
  category?: string; // عمده‌فروش، خرده‌فروش، دولتی، نمایندگی
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
  category?: string; // مواد اولیه، قطعات، خدمات، خارجی
  rating?: number; // 1-5
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
