import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxDocument,
  RxCollection,
  RxDatabase,
  RxAttachment,
} from 'rxdb';
import { productSchemaLiteral } from '../schemas/product.schema';
import { BehaviorSubject } from 'rxjs';

const schemaTyped = toTypedRxJsonSchema(productSchemaLiteral);

export type ProductDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const productSchema: RxJsonSchema<ProductDocType> = productSchemaLiteral;

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
};

export type ProductCollection = RxCollection<
  ProductDocType,
  ProductDocMethods,
  ProductCollectionMethods
>;

export type DatabaseCollections = {
  products: ProductCollection;
};

export type Database = RxDatabase<DatabaseCollections>;
