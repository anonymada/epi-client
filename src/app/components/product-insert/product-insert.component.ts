import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { close, trashBin } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import {
  IonInput,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonContent,
  IonIcon,
  ModalController,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ProductDocument } from 'src/app/types/products.types';

@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonCol,
    IonRow,
    IonGrid,
    CommonModule,
    IonIcon,
    IonContent,
    IonTitle,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonModal,
    IonButton,
    IonInput,
    ReactiveFormsModule,
  ],
})
export class ProductInsertComponent implements OnInit {
  @Input() isAdd!: boolean;
  @Input() item!: ProductDocument;
  productForm!: FormGroup;

  constructor(
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    private editModalController: ModalController
  ) {
    addIcons({ close, trashBin });
    this.productForm = this.formBuilder.group({
      id: [''],
      name: [''],
      decription: [''],
      category: [''],
      price: [''],
    });
  }

  ngOnInit(): void {
    if (this.item != null && !this.isAdd) {
      Object.keys(this.productForm.controls).forEach((control) => {
        this.productForm
          .get(control)
          ?.setValue(this.item[control as keyof typeof this.item]);
      });
    }
    if (this.isAdd) {
      this.productForm.get('id')?.setValue(this.getUniqueId(4));
    }
  }

  async save() {
    const db = await this.databaseService.get();
    if (this.isAdd) {
      db.products
        .insertProduct(this.productForm.getRawValue())
        .then((p: any) => {
          if (p) {
            this.editModalController.dismiss(null, 'cancel');
          } else {
            //error handling
          }
        });
    } else {
      db.products
        .updateProduct(this.productForm.getRawValue())
        .then((p: any) => {
          if (p) {
            this.editModalController.dismiss(null, 'cancel');
          } else {
          }
          //error handling
        });
    }
  }

  async delete(item: ProductDocument) {
    const db = await this.databaseService.get();
    db.products.deleteProduct(item).then(() => {
      this.editModalController.dismiss(null, 'cancel');
    });
  }

  close() {
    this.editModalController.dismiss(null, 'cancel');
  }

  private getUniqueId(parts: number): string {
    const stringArr = [];
    for (let i = 0; i < parts; i++) {
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0)
        .toString(16)
        .substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }
}
