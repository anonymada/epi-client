import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonFab,
} from '@ionic/angular/standalone';
import { ProductInsertComponent } from 'src/app/components/product-insert/product-insert.component';
import { ProductsListComponent } from 'src/app/components/products-list/products-list.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ProductsListComponent,
    ProductInsertComponent,
  ],
})
export class Tab1Page {
  constructor() {}
}
