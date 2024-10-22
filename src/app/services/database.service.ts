import { Injectable } from '@angular/core';
import { addRxPlugin, blobToString, createBlob, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';
import {
  Database,
  ProductCollection,
  ProductCollectionMethods,
  ProductDocMethods,
  ProductDocument,
  QuantityCollection,
  QuantityCollectionMethods,
  QuantityDocMethods,
  QuantityDocument,
  PriceCollection,
  PriceCollectionMethods,
  PriceDocMethods,
  PriceDocument,
  PriceSchema,
  ProductSchema,
  QuantitySchema,
  DatabaseCollections,
} from '../types/app.types';
import { formatDate } from '@angular/common';

addRxPlugin(RxDBAttachmentsPlugin);
addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

const ID_PARTS = 4;
const DATE_NOW = Date.now();

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  static dbPromise: Promise<Database>;

  constructor() {}

  private async _create(): Promise<Database> {
    // database initialization
    console.log('DatabaseService >> creating database..');

    const db: Database = await createRxDatabase({
      name: 'appdb',
      storage: getRxStorageDexie(),
      ignoreDuplicate: true, //for tesT only
    });

    console.log('DatabaseService >> created database : ' + db.name);

    // show leadership in title
    db.waitForLeadership().then(() => {
      document.title = '🛍️ ' + document.title;
    });

    // definition of collections and dcouments methods
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
      listAllProducts: function (
        this: ProductCollection
      ): BehaviorSubject<ProductDocument[]> {
        return this.find().$ as BehaviorSubject<ProductDocument[]>;
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

      generateProductId: function (): string {
        const stringArr = [];
        for (let i = 0; i < ID_PARTS; i++) {
          // tslint:disable-next-line:no-bitwise
          const S4 = (((1 + Math.random()) * 0x10000) | 0)
            .toString(16)
            .substring(1);
          stringArr.push(S4);
        }
        return stringArr.join('-');
      },
    };

    const quantityDocMethods: QuantityDocMethods = {};

    const quantityCollectionMethods: QuantityCollectionMethods = {
      insertQuantity: function (
        this: QuantityCollection,
        q: QuantityDocument
      ): Promise<QuantityDocument> {
        const Q = Object.keys(QuantitySchema.properties).reduce(
          (o, key) => Object.assign(o, { [key]: q[key as keyof typeof q] }),
          {}
        ) as QuantityDocument;
        Q.quantityRegisteredDate = DATE_NOW;
        console.log(Q);
        return this.insert(Q);
      },

      generateQuantityId: function (): string {
        const stringArr = [];
        for (let i = 0; i < ID_PARTS; i++) {
          // tslint:disable-next-line:no-bitwise
          const S4 = (((1 + Math.random()) * 0x10000) | 0)
            .toString(16)
            .substring(1);
          stringArr.push(S4);
        }
        return stringArr.join('-');
      },

      getProductQuantities: function (
        this: QuantityCollection,
        p: ProductDocument
      ): Promise<QuantityDocument[]> {
        const query = this.find()
          .where('idProduct')
          .eq(p.idProduct)
          .sort('quantityRegisteredDate');
        return firstValueFrom(query.$);
      },
    };

    const priceDocMethods: PriceDocMethods = {};

    const priceCollectionMethods: PriceCollectionMethods = {
      insertPrice: async function (
        this: PriceCollection,
        p: PriceDocument
      ): Promise<PriceDocument> {
        const P = Object.keys(PriceSchema.properties).reduce(
          (o, key) => Object.assign(o, { [key]: p[key as keyof typeof p] }),
          {}
        ) as PriceDocument;
        P.priceRegisteredDate = DATE_NOW;
        console.log(P);
        return this.insert(P);
      },

      generatePriceId: function (): string {
        const stringArr = [];
        for (let i = 0; i < ID_PARTS; i++) {
          // tslint:disable-next-line:no-bitwise
          const S4 = (((1 + Math.random()) * 0x10000) | 0)
            .toString(16)
            .substring(1);
          stringArr.push(S4);
        }
        return stringArr.join('-');
      },

      getProductPrices: function (
        this: PriceCollection,
        p: ProductDocument
      ): Promise<PriceDocument[]> {
        const query = this.find()
          .where('idProduct')
          .eq(p.idProduct)
          .sort('priceRegisteredDate');
        return firstValueFrom(query.$);
      },
    };

    // add database collections
    console.log('DatabaseService >> creating collections ...');

    const collection = await db.addCollections({
      products: {
        schema: ProductSchema,
        methods: productDocMethods,
        statics: productCollectionMethods,
        // migrationStrategies: {
        //   1: function (oldDoc) {
        //     return oldDoc;
        //   },
        // },
      },
      prices: {
        schema: PriceSchema,
        methods: priceDocMethods,
        statics: priceCollectionMethods,
      },
      quantities: {
        schema: QuantitySchema,
        methods: quantityDocMethods,
        statics: quantityCollectionMethods,
      },
    });

    console.log(
      'DatabaseService >> created collections  : ' +
        collection.products.name +
        ', ' +
        collection.prices.name +
        ', ' +
        collection.quantities.name
    );

    // collection.prices.exportJSON().then((json) => console.dir(json));

    return db;
  }

  get(): Promise<Database> {
    if (DatabaseService.dbPromise) return DatabaseService.dbPromise;
    DatabaseService.dbPromise = this._create();
    return DatabaseService.dbPromise;
  }
}
