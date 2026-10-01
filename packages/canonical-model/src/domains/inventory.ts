import { BaseCanonicalEntity } from '../base/metadata.js';

export type ProductType = 'FINISHED_GOODS' | 'RAW_MATERIAL' | 'SEMI_FINISHED' | 'SPARE_PART' | 'CONSUMABLE' | 'SERVICE';

export interface Product extends BaseCanonicalEntity {
  code: string;
  nameFa: string;
  nameEn?: string;
  productType: ProductType;
  categoryId?: string;
  primaryUom: string; // واحد سنجش اصلی (کیلوگرم، عدد، کارتن، متر، تن)
  secondaryUom?: string;
  uomConversionFactor?: number;
  standardCostRial?: number;
  lastPurchasePriceRial?: number;
  standardSellingPriceRial?: number;
  safetyStockQty?: number;
  reorderPointQty?: number;
  leadTimeDays?: number;
  isActive: boolean;
}

export interface Category extends BaseCanonicalEntity {
  code: string;
  titleFa: string;
  titleEn?: string;
  parentCategoryId?: string;
}

export interface Warehouse extends BaseCanonicalEntity {
  code: string;
  titleFa: string;
  titleEn?: string;
  warehouseType: 'CENTRAL' | 'RAW_MATERIALS' | 'FINISHED_GOODS' | 'SPARE_PARTS' | 'TRANSIT' | 'REJECTED';
  locationAddress?: string;
  isActive: boolean;
}

export interface InventoryItem extends BaseCanonicalEntity {
  warehouseId: string;
  productId: string;
  batchNumber?: string;
  onHandQty: number;
  reservedQty: number;
  availableQty: number;
  averageUnitCostRial: number;
  totalValueRial: number;
  lastMovementDateJalali?: string;
}

export type MovementType =
  | 'GOODS_RECEIPT'        // رسید انبار (خرید یا تولید)
  | 'GOODS_ISSUE'          // حواله انبار (فروش یا مصرف)
  | 'TRANSFER_IN'          // انتقال بین انبار ورودی
  | 'TRANSFER_OUT'         // انتقال بین انبار خروجی
  | 'ADJUSTMENT_INCREASE'  // تعدیل مثبت انبارگردانی
  | 'ADJUSTMENT_DECREASE'  // تعدیل منفی انبارگردانی
  | 'PRODUCTION_WASTE';    // ضایعات انبار

export interface InventoryMovement extends BaseCanonicalEntity {
  documentNumber: string;
  movementType: MovementType;
  movementDateJalali: string;
  movementDateGregorian: string;
  warehouseId: string;
  productId: string;
  batchNumber?: string;
  quantity: number;
  unitCostRial: number;
  totalCostRial: number;
  referenceDocumentType?: string; // e.g., 'INVOICE', 'PRODUCTION_ORDER', 'PURCHASE_ORDER'
  referenceDocumentId?: string;
  counterpartWarehouseId?: string;
  notes?: string;
}
