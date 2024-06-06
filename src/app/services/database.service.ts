import { Injectable } from '@angular/core';
import { addRxPlugin, createRxDatabase, RxDocument, RxJsonSchema } from 'rxdb';
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
import { BehaviorSubject } from 'rxjs';
addRxPlugin(RxDBLeaderElectionPlugin);

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

    const productDocMethods: ProductDocMethods = {};

    const productCollectionMethods: ProductCollectionMethods = {
      countAllProducts: async function (this: ProductCollection) {
        const allDocs = await this.find().exec();
        return allDocs.length;
      },

      listAllProducts: function (this: ProductCollection) {
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

      deleteProduct: function (p: ProductDocument): Promise<any> {
        return p.remove();
      },
    };

    // const productSchema: RxJsonSchema<ProductDocType> = {
    //   title: 'product schema',
    //   description: 'describes a product',
    //   version: 0,
    //   keyCompression: true,
    //   primaryKey: 'id',
    //   type: 'object',
    //   properties: {
    //     id: {
    //       type: 'string',
    //     },
    //     name: {
    //       type: 'string',
    //     },
    //     category: {
    //       type: 'string',
    //     },
    //     price: {
    //       type: 'number',
    //     },
    //   },
    //   required: ['id'],
    // };

    // create collections
    console.log('DatabaseService >> creating collections ...');
    const productCollection = await db.addCollections({
      products: {
        schema: productSchema,
        methods: productDocMethods,
        statics: productCollectionMethods,
      },
    });
    console.log(
      'DatabaseService >> created collections  : ' +
        productCollection.products.name
    );

    return db;
  }

  get(): Promise<Database> {
    if (DatabaseService.dbPromise) return DatabaseService.dbPromise;
    DatabaseService.dbPromise = this._create();
    return DatabaseService.dbPromise;
  }
}
