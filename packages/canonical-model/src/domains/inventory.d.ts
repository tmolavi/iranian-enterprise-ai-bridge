import { BaseCanonicalEntity } from '../base/metadata.js';
export type ProductType = 'FINISHED_GOODS' | 'RAW_MATERIAL' | 'SEMI_FINISHED' | 'SPARE_PART' | 'CONSUMABLE' | 'SERVICE';
export interface Product extends BaseCanonicalEntity {
    code: string;
    nameFa: string;
    nameEn?: string;
    productType: ProductType;
    categoryId?: string;
    primaryUom: string;
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
export type MovementType = 'GOODS_RECEIPT' | 'GOODS_ISSUE' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ADJUSTMENT_INCREASE' | 'ADJUSTMENT_DECREASE' | 'PRODUCTION_WASTE';
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
    referenceDocumentType?: string;
    referenceDocumentId?: string;
    counterpartWarehouseId?: string;
    notes?: string;
}
//# sourceMappingURL=inventory.d.ts.map