import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductsListComponent } from 'src/app/components/products-list/products-list.component';
import { add } from 'ionicons/icons';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonFabButton,
  IonIcon,
  IonFab,
  ModalController,
} from '@ionic/angular/standalone';
import { ProductInsertComponent } from '../../../components/product-insert/product-insert.component';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonFab,
    IonIcon,
    IonFabButton,
    IonTitle,
    IonToolbar,
    IonContent,
    IonHeader,
    CommonModule,
    ProductsListComponent,
    ProductInsertComponent,
  ],
})
export class Tab1Page {
  constructor(private addModalController: ModalController) {
    addIcons({ add });
  }

  async showAddProduct() {
    const addModal = await this.addModalController.create({
      component: ProductInsertComponent,
      componentProps: {
        isAdd: true,
      },
    });
    addModal.present();
  }
}
