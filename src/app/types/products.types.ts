import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxDocument,
  RxCollection,
  RxDatabase,
} from 'rxdb';
import { productSchemaLiteral } from '../schemas/product.schema';

const schemaTyped = toTypedRxJsonSchema(productSchemaLiteral);

// aggregate the document type from the schema
export type ProductDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof schemaTyped
>;

// create the typed RxJsonSchema from the literal typed object.
export const productSchema: RxJsonSchema<ProductDocType> = productSchemaLiteral;

export type ProductDocMethods = {};

export type ProductDocument = RxDocument<ProductDocType, ProductDocMethods>;

// we declare one static ORM-method for the collection
export type ProductCollectionMethods = {
  countAllDocuments: () => Promise<number>;
};

// and then merge all our types
export type ProductCollection = RxCollection<
  ProductDocType,
  ProductDocMethods,
  ProductCollectionMethods
>;

export type DatabaseCollections = {
  products: ProductCollection;
};

export type Database = RxDatabase<DatabaseCollections>;
