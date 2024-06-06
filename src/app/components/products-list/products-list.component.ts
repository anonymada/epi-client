import { Component, NgZone, OnInit } from '@angular/core';
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
import { ProductDocument } from 'src/app/types/products.types';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductInsertComponent } from '../product-insert/product-insert.component';

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
  products!: any;
  totalProducts!: number;
  searchTerm!: string;

  constructor(
    private databaseService: DatabaseService,
    private editModalController: ModalController
  ) {}

  async ngOnInit() {
    const db = await this.databaseService.get();
    db.products.listAllProducts().subscribe((p) => {
      this.products = p;
    });
  }

  async showEditProduct(product: ProductDocument) {
    const editModal = await this.editModalController.create({
      component: ProductInsertComponent,
      componentProps: {
        item: product,
        isAdd: false,
      },
    });
    editModal.present();
  }
}
