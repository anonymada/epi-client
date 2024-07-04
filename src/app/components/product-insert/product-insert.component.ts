import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { calculator, close, trashBin } from 'ionicons/icons';
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
  IonThumbnail,
  IonTextarea,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonPopover,
  PopoverController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ProductDocument } from 'src/app/types/products.types';
import { NgPipesModule } from 'ngx-pipes';
import { PhotoComponent } from '../photo/photo.component';
import { CalculatorComponent } from '../calculator/calculator.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.scss'],
  standalone: true,
  imports: [
    IonPopover,
    IonLabel,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonTextarea,
    IonFooter,
    IonCol,
    IonRow,
    IonGrid,
    IonThumbnail,
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
    CommonModule,
    NgPipesModule,
    PhotoComponent,
    HttpClientModule,
    CalculatorComponent,
  ],
})
export class ProductInsertComponent implements OnInit {
  @Input() isAdd!: boolean;
  @Input() item!: ProductDocument;
  @ViewChild('buyingPrice', { static: true }) buyingPrice!: IonInput;
  @ViewChild('sellingPrice', { static: true }) sellingPrice!: IonInput;
  productForm!: FormGroup;
  productCategory: string[] = [];
  productConditionningType: string[] = [];
  private productImageEl!: HTMLImageElement;
  productImageBase64String: string = '';
  private productImageType: string = 'text/plain';

  constructor(
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    private editModalController: ModalController,
    private http: HttpClient
  ) {
    addIcons({ close, trashBin, calculator });
    this.productForm = this.formBuilder.group({
      id: [''],
      name: [''],
      description: [''],
      category: [''],
      conditionningType: [''],
      buyingPrice: [''],
      sellingPrice: [''],
      profitMargin: [''],
      stockQuantity: [''],
      supplyQuantity: [''],
      soldQuantity: [''],
    });
  }

  async ngOnInit() {
    const db = await this.databaseService.get();
    this.productCategory = db.products.getAllCategories();
    this.productConditionningType = db.products.getAllConditionningType();

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

    if (!this.isAdd) {
      this.item.getImage(this.item.id)!.then((imageBase64: any) => {
        this.productImageEl = document.getElementById(
          'productImageElt'
        ) as HTMLImageElement;
        this.productImageEl.src = imageBase64;
      });
    }

    this.getBase64DefaultProductImage();
  }

  async save() {
    const db = await this.databaseService.get();
    if (this.isAdd) {
      if (this.productImageBase64String != '') {
        db.products
          .insertProduct(this.productForm.getRawValue())
          .then((p: ProductDocument) => {
            if (p) {
              p.addImage(
                p.id,
                this.productImageBase64String,
                this.productImageType
              ).then(() => {
                this.editModalController.dismiss(null, 'cancel');
              });
            } else {
              //error handling
            }
          });
      }
    } else {
      db.products
        .updateProduct(this.productForm.getRawValue())
        .then((p: ProductDocument) => {
          if (p) {
            p.addImage(
              p.id,
              this.productImageBase64String,
              this.productImageType
            ).then(() => {
              this.editModalController.dismiss(null, 'cancel');
            });
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

  calculateProfitMargin(e: any) {
    this.productForm
      .get('profitMargin')
      ?.setValue(
        this.productForm.get('sellingPrice')?.value -
          this.productForm.get('buyingPrice')?.value
      );
  }

  async calculateField(ev: any, el: string) {
    console.log(ev);
    if (el == 'buyingPrice') {
      this.productForm.get('buyingPrice')?.setValue(ev);
    }
    if (el == 'sellingPrice') {
      this.productForm.get('sellingPrice')?.setValue(ev);
    }
  }

  changePhoto(imageBase64: any) {
    this.productImageEl = document.getElementById(
      'productImageElt'
    ) as HTMLImageElement;
    this.productImageEl.src = imageBase64;
    this.productImageBase64String = imageBase64;
  }

  getBase64DefaultProductImage() {
    this.http
      .get('../../../assets/images/products.png', { responseType: 'blob' })
      .subscribe((res) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.productImageBase64String = reader.result as string;
        };
        reader.readAsDataURL(res);
      });
  }
}
