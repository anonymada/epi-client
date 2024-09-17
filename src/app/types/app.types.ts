import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxDocument,
  RxCollection,
  RxDatabase,
} from 'rxdb';
import { productSchemaLiteral } from '../schemas/product.schema';
import { priceSchemaLiteral } from '../schemas/price.schema';
import { quantitySchemaLiteral } from '../schemas/quantity.schema';
import { BehaviorSubject } from 'rxjs';

// PRODUCT TYPE DEFINITION
const productSchemaTyped = toTypedRxJsonSchema(productSchemaLiteral);

export type ProductDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof productSchemaTyped
>;

export const ProductSchema: RxJsonSchema<ProductDocType> = productSchemaLiteral;

export type ProductDocMethods = {
  addImage: (id: string, data: any, type: string) => Promise<any>;
  getImage: (id: string) => Promise<string>;
};

export type ProductDocument = RxDocument<ProductDocType, ProductDocMethods>;

export type ProductCollectionMethods = {
  countAllProducts: () => Promise<number>;
  listAllProducts: () => BehaviorSubject<ProductDocument[]>;
  insertProduct: (p: ProductDocument) => Promise<ProductDocument>;
  updateProduct: (p: ProductDocument) => Promise<ProductDocument>;
  deleteProduct: (p: ProductDocument) => Promise<ProductDocument>;
  bulkDeleteProduct: (ids: string[]) => Promise<any>;
  getAllCategories: () => string[];
  getAllConditionningType: () => string[];
  generateProductId: () => string;
};

export type ProductCollection = RxCollection<
  ProductDocType,
  ProductDocMethods,
  ProductCollectionMethods
>;

// PRICE TYPE DEFINITION
const priceSchemaTyped = toTypedRxJsonSchema(priceSchemaLiteral);

export type PriceDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof priceSchemaTyped
>;

export const PriceSchema: RxJsonSchema<PriceDocType> = priceSchemaLiteral;

export type PriceDocMethods = {};

export type PriceDocument = RxDocument<PriceDocType, PriceDocMethods>;

export type PriceCollectionMethods = {
  insertPrice: (p: PriceDocument) => Promise<PriceDocument>;
  generatePriceId: () => string;
  getProductPrices: (p: ProductDocument) => Promise<PriceDocument[]>; 
};

export type PriceCollection = RxCollection<
  PriceDocType,
  PriceDocMethods,
  PriceCollectionMethods
>;

// QUANTITY TYPE DEFINITION
const quantitySchemaTyped = toTypedRxJsonSchema(quantitySchemaLiteral);

export type QuantityDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof quantitySchemaTyped
>;

export const QuantitySchema: RxJsonSchema<QuantityDocType> =
  quantitySchemaLiteral;

export type QuantityDocMethods = {};

export type QuantityDocument = RxDocument<QuantityDocType, QuantityDocMethods>;

export type QuantityCollectionMethods = {
  insertQuantity: (p: QuantityDocument) => Promise<QuantityDocument>;
  generateQuantityId: () => string;
  getProductQuantities: (p: ProductDocument) => Promise<QuantityDocument[]>;
};

export type QuantityCollection = RxCollection<
  QuantityDocType,
  QuantityDocMethods,
  QuantityCollectionMethods
>;

// DATABASE TYPE DEFINITION
export type DatabaseCollections = {
  products: ProductCollection;
  prices: PriceCollection;
  quantities: QuantityCollection;
};

export type Database = RxDatabase<DatabaseCollections>;
