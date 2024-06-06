import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxDocument,
  RxCollection,
  RxDatabase,
} from 'rxdb';
import { productSchemaLiteral } from '../schemas/product.schema';
import { BehaviorSubject, Observable } from 'rxjs';

const schemaTyped = toTypedRxJsonSchema(productSchemaLiteral);

export type ProductDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

export const productSchema: RxJsonSchema<ProductDocType> = productSchemaLiteral;

export type ProductDocMethods = {};

export type ProductDocument = RxDocument<ProductDocType, ProductDocMethods>;

export type ProductCollectionMethods = {
  countAllProducts: () => Promise<number>;
  listAllProducts: () => BehaviorSubject<ProductDocument[]>;
  insertProduct: (p: ProductDocument) => Promise<ProductDocument>;
  updateProduct: (p: ProductDocument) => Promise<ProductDocument>;
  deleteProduct: (p: ProductDocument) => Promise<any>;
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
