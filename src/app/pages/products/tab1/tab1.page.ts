import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { ProductEditComponent } from 'src/app/components/product-edit/product-edit.component';
import { ProductInsertComponent } from 'src/app/components/product-insert/product-insert.component';
import { ProductsListComponent } from 'src/app/components/products-list/products-list.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ProductsListComponent,
    ProductEditComponent,
    ProductInsertComponent,
  ],
})
export class Tab1Page {
  constructor() {}
}
