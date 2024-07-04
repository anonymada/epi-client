import { Injectable } from '@angular/core';
import {
  RxJsonSchema,
  addRxPlugin,
  blobToBase64String,
  blobToString,
  createBlob,
  createRxDatabase,
} from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import {
  Database,
  ProductCollection,
  ProductCollectionMethods,
  ProductDocMethods,
  ProductDocument,
  productSchema,
} from '../types/products.types';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { BehaviorSubject } from 'rxjs';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
addRxPlugin(RxDBAttachmentsPlugin);
addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBMigrationPlugin);

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  static dbPromise: Promise<Database>;

  constructor() {}

  private async _create(): Promise<Database> {
    console.log('DatabaseService >> creating database..');

    const db: Database = await createRxDatabase({
      name: 'appdb',
      storage: getRxStorageDexie(),
      ignoreDuplicate: true, //for tesT only
    });

    console.log('DatabaseService >> created database : ' + db.name);

    // show leadership in title
    db.waitForLeadership().then(() => {
      document.title = '♛ ' + document.title;
    });

    const productDocMethods: ProductDocMethods = {
      addImage: function (
        this: ProductDocument,
        id: string,
        data: any,
        type: string
      ): Promise<any> {
        return this.putAttachment({
          id: id,
          data: createBlob(data, type),
          type: type,
        });
      },

      getImage: async function (
        this: ProductDocument,
        id: string
      ): Promise<string> {
        const attachement = this.getAttachment(id);
        let blob: any;
        if (attachement) {
          blob = await attachement.getData();
        } else blob = new Blob();
        return blobToString(blob);
      },
    };

    const productCollectionMethods: ProductCollectionMethods = {
      countAllProducts: async function (this: ProductCollection) {
        const allDocs = await this.find().exec();
        return allDocs.length;
      },

      listAllProducts: function (
        this: ProductCollection
      ): BehaviorSubject<ProductDocument[]> {
        return this.find().$;
      },

      insertProduct: function (
        this: ProductCollection,
        newProduct: ProductDocument
      ): Promise<ProductDocument> {
        return this.insert(newProduct);
      },

      updateProduct: function (
        this: ProductCollection,
        p: ProductDocument
      ): Promise<ProductDocument> {
        return this.upsert(p);
      },

      deleteProduct: function (p: ProductDocument): Promise<ProductDocument> {
        return p.remove();
      },

      getAllCategories: function (this: ProductCollection): string[] {
        let categories: string[] = [];
        this.find().$.subscribe((doc) => {
          doc.forEach((p) => {
            categories.push(p.category as string);
          });
        });
        return [...new Set(categories)];
      },

      getAllConditionningType: function (this: ProductCollection): string[] {
        let conditionningType: string[] = [];
        this.find().$.subscribe((doc) => {
          doc.forEach((p) => {
            conditionningType.push(p.conditionningType as string);
          });
        });
        return [...new Set(conditionningType)];
      },

      bulkDeleteProduct: function (ids: string[]): Promise<any> {
        return db.products.bulkRemove(ids);
      },
    };

    // const productSchema: RxJsonSchema<ProductDocType> = {
    //   title: 'product schema',
    //   description: 'describes a product',
    //   version: 0,
    //   primaryKey: 'id',
    //   type: 'object',
    //   properties: {
    //     id: {
    //       type: 'string',
    //       maxLength: 100, // <- the primary key must have set maxLength
    //     },
    //     name: {
    //       type: 'string',
    //     },
    //     description: {
    //       type: 'string',
    //     },
    //     category: {
    //       type: 'string',
    //     },
    //     conditionningType: {
    //       type: 'string',
    //     },
    //     buyingPrice: {
    //       type: 'number',
    //     },
    //     sellingPrice: {
    //       type: 'number',
    //     },
    //     profitMargin: {
    //       type: 'number',
    //     },
    //     stockQuantity: {
    //       type: 'number',
    //     },
    //     supplyQuantity: {
    //       type: 'number',
    //     },
    //     soldQuantity: {
    //       type: 'number',
    //     },
    //   },
    //   required: [
    //     'id',
    //     'name',
    //     'conditionningType',
    //     'buyingPrice',
    //     'sellingPrice',
    //     'supplyQuantity',
    //   ],
    //   indexes: ['name'],
    // };

    // create collections
    console.log('DatabaseService >> creating collections ...');
    const productCollection = await db.addCollections({
      products: {
        schema: productSchema,
        methods: productDocMethods,
        statics: productCollectionMethods,
        migrationStrategies: {
          1: function (oldDoc) {
            return oldDoc;
          },
        },
      },
    });
    console.log(
      'DatabaseService >> created collections  : ' +
        productCollection.products.name
    );
    // productCollection.products.exportJSON().then((json) => console.dir(json));
    // db.products.calculateFields();
    return db;
  }

  get(): Promise<Database> {
    if (DatabaseService.dbPromise) return DatabaseService.dbPromise;
    DatabaseService.dbPromise = this._create();
    return DatabaseService.dbPromise;
  }
}
