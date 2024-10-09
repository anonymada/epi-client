import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import {
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonLabel,
  IonItem,
  IonFabList,
  IonFabButton,
  IonFab,
  IonContent,
  ModalController,
  IonButton,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import {
  PriceDocument,
  ProductDocument,
  QuantityDocument,
} from 'src/app/types/app.types';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductInsertComponent } from '../product-insert/product-insert.component';
import { addIcons } from 'ionicons';
import { trashBin } from 'ionicons/icons';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports: [
    IonSkeletonText,
    CommonModule,
    FormsModule,
    NgPipesModule,
    IonSearchbar,
    IonButton,
    IonContent,
    IonFab,
    IonFabButton,
    IonFabList,
    IonItem,
    IonLabel,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonSpinner,
    ProductCardComponent,
    ProductInsertComponent,
  ],
})
export class ProductsListComponent implements OnInit {
  products!: ProductDocument[];
  totalProducts!: number;
  searchTerm!: string;
  productToDelete: string[] = [];
  isTrashBinVisible: boolean = false;
  db: any;

  constructor(
    private databaseService: DatabaseService,
    private editModalController: ModalController
  ) {
    addIcons({ trashBin });
  }

  async ngOnInit() {
    this.db = await this.databaseService.get();
    this.db.products.listAllProducts().subscribe((p: ProductDocument[]) => {
      this.products = p;
    });
  }

  async showEditProduct(product: ProductDocument) {
    const editModal = await this.editModalController.create({
      component: ProductInsertComponent,
      componentProps: {
        item: product,
        itemPrice: '',
        itemQuantity: '',
        isAdd: false,
      },
    });
    editModal.present();
  }

  selectProductToDelete(item: ProductDocument) {
    if (!this.productToDelete.includes(item.idProduct)) {
      this.productToDelete.push(item.idProduct);
    } else {
      this.productToDelete = this.productToDelete.filter(
        (productId) => productId != item.idProduct
      );
    }

    if (this.productToDelete.length != 0) {
      this.isTrashBinVisible = true;
    } else {
      this.isTrashBinVisible = false;
    }
  }

  async bulkDelete() {
    this.db.products
      .bulkDeleteProduct(this.productToDelete)
      .then((val: { error: string | any[] }) => {
        if (val.error.length == 0) {
          this.productToDelete = [];
          this.isTrashBinVisible = false;
        } else {
          // error handling
        }
      });
  }
}
