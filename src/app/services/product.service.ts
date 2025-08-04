import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, firstValueFrom } from 'rxjs';
import { DatabaseService } from './database.service';
import { ErrorHandlingService } from './error-handling.service';
import { ProductDocument, PriceDocument, QuantityDocument } from '../types/app.types';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private db: any;
  private productsSubject = new BehaviorSubject<ProductDocument[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(
    private databaseService: DatabaseService,
    private errorHandler: ErrorHandlingService
  ) {
    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    try {
      this.db = await this.databaseService.get();
      this.loadProducts();
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.initializeDatabase');
    }
  }

  private loadProducts(): void {
    try {
      this.db.products.listAllProducts().subscribe((products: ProductDocument[]) => {
        this.productsSubject.next(products);
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.loadProducts');
    }
  }

  async createProduct(productData: any): Promise<ProductDocument | null> {
    try {
      const product = await this.db.products.insertProduct(productData);
      
      if (productData.imageBase64) {
        await product.addImage(
          product.idProduct,
          productData.imageBase64,
          productData.imageType || 'image/png'
        );
      }

      await this.db.prices.insertPrice(productData);
      await this.db.quantities.insertQuantity(productData);

      this.errorHandler.handleSuccess('Produit créé avec succès');
      return product;
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.createProduct');
      return null;
    }
  }

  async updateProduct(productData: any): Promise<ProductDocument | null> {
    try {
      const product = await this.db.products.updateProduct(productData);
      
      if (productData.imageBase64) {
        await product.addImage(
          product.idProduct,
          productData.imageBase64,
          productData.imageType || 'image/png'
        );
      }

      await this.db.prices.insertPrice(productData);
      await this.db.quantities.insertQuantity(productData);

      this.errorHandler.handleSuccess('Produit modifié avec succès');
      return product;
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.updateProduct');
      return null;
    }
  }

  async deleteProduct(product: ProductDocument): Promise<boolean> {
    try {
      await this.db.products.deleteProduct(product);
      this.errorHandler.handleSuccess('Produit supprimé avec succès');
      return true;
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.deleteProduct');
      return false;
    }
  }

  async bulkDeleteProducts(productIds: string[]): Promise<boolean> {
    try {
      const result = await this.db.products.bulkDeleteProduct(productIds);
      if (result.error.length === 0) {
        this.errorHandler.handleSuccess(`${productIds.length} produits supprimés`);
        return true;
      } else {
        this.errorHandler.handleError('Erreur lors de la suppression en masse');
        return false;
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.bulkDeleteProducts');
      return false;
    }
  }

  async getProductPrices(product: ProductDocument): Promise<PriceDocument[]> {
    try {
      return await this.db.prices.getProductPrices(product);
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.getProductPrices');
      return [];
    }
  }

  async getProductQuantities(product: ProductDocument): Promise<QuantityDocument[]> {
    try {
      return await this.db.quantities.getProductQuantities(product);
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.getProductQuantities');
      return [];
    }
  }

  async calculateStockValue(products: ProductDocument[]): Promise<number> {
    try {
      const values = await Promise.all(
        products.map(async (product) => {
          const prices = await this.getProductPrices(product);
          const quantities = await this.getProductQuantities(product);
          
          if (prices.length === 0 || quantities.length === 0) return 0;
          
          const latestPrice = prices[prices.length - 1];
          const latestQuantity = quantities[quantities.length - 1];
          
          return latestPrice.buyingPrice * latestQuantity.stockQuantity;
        })
      );
      
      return values.reduce((acc, value) => acc + value, 0);
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.calculateStockValue');
      return 0;
    }
  }

  async calculateMeanProfitMargin(products: ProductDocument[]): Promise<number> {
    try {
      const margins = await Promise.all(
        products.map(async (product) => {
          const prices = await this.getProductPrices(product);
          
          if (prices.length === 0) return 0;
          
          const latestPrice = prices[prices.length - 1];
          const margin = ((latestPrice.sellingPrice - latestPrice.buyingPrice) / latestPrice.sellingPrice) * 100;
          
          return isNaN(margin) ? 0 : margin;
        })
      );
      
      const validMargins = margins.filter(margin => margin > 0);
      return validMargins.length === 0 ? 0 : 
        Math.ceil(validMargins.reduce((acc, margin) => acc + margin, 0) / validMargins.length);
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.calculateMeanProfitMargin');
      return 0;
    }
  }

  getCategories(): string[] {
    try {
      return this.db?.products?.getAllCategories() || [];
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.getCategories');
      return [];
    }
  }

  getConditionningTypes(): string[] {
    try {
      return this.db?.products?.getAllConditionningType() || [];
    } catch (error) {
      this.errorHandler.handleError(error, 'ProductService.getConditionningTypes');
      return [];
    }
  }

  generateProductId(): string {
    return this.db?.products?.generateProductId() || '';
  }

  generatePriceId(): string {
    return this.db?.prices?.generatePriceId() || '';
  }

  generateQuantityId(): string {
    return this.db?.quantities?.generateQuantityId() || '';
  }
}