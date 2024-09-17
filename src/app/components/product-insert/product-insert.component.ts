import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { calculator, trashBin, arrowBack } from 'ionicons/icons';
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
  IonSelect,
  IonSelectOption,
  IonDatetimeButton,
  IonDatetime,
  IonCardSubtitle,
  IonCard,
  IonNote,
} from '@ionic/angular/standalone';
import { CommonModule, formatDate } from '@angular/common';
import {
  PriceDocument,
  ProductDocument,
  QuantityDocument,
} from 'src/app/types/app.types';
import { NgPipesModule } from 'ngx-pipes';
import { PhotoComponent } from '../photo/photo.component';
import { CalculatorComponent } from '../calculator/calculator.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.scss'],
  standalone: true,
  imports: [
    IonNote,
    IonCard,
    IonCardSubtitle,
    IonDatetime,
    IonDatetimeButton,
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
    IonSelect,
    IonSelectOption,
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
    TranslateModule,
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
  @Input() itemPrice!: PriceDocument;
  @Input() itemQuantity!: QuantityDocument;
  @ViewChild('buyingPrice', { static: true }) buyingPrice!: IonInput;
  @ViewChild('sellingPrice', { static: true }) sellingPrice!: IonInput;
  productForm!: FormGroup;
  productCategory: string[] = [];
  productConditionningType: string[] = [];
  private productImageEl!: HTMLImageElement;
  productImageBase64String: string = '';
  private productImageType: string = 'text/plain';
  uniteMonetaire: string = '[Ariary]';
  db: any;

  constructor(
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder,
    private editModalController: ModalController,
    private http: HttpClient
  ) {
    addIcons({ arrowBack, calculator, trashBin });

    this.initializeForms();
  }

  async ngOnInit() {
    this.db = await this.databaseService.get();
    this.productCategory = this.db.products.getAllCategories();
    this.productConditionningType = this.db.products.getAllConditionningType();

    // populate all fields with database data (edit)
    if (!this.isAdd && this.item != null) {
      Object.keys(this.productForm.controls).forEach((control) => {
        Object.keys(this.item._data).forEach((itemKey) => {
          if (control == itemKey) {
            this.productForm
              .get(control)
              ?.setValue(this.item[control as keyof typeof this.item]);
          }
        });
      });
      this.db.prices.getProductPrices(this.item).then((P: any) => {
        console.log(P);
        Object.keys(this.productForm.controls).forEach((control) => {
          Object.keys(P[P.length - 1]._data).forEach((itemKey) => {
            if (control == itemKey && control != 'idPrice') {
              this.productForm
                .get(control)
                ?.setValue(P[P.length - 1][control as keyof typeof P]);
            }
          });
        });
      });
      this.db.quantities.getProductQuantities(this.item).then((Q: any) => {
        Object.keys(this.productForm.controls).forEach((control) => {
          Object.keys(Q[Q.length - 1]._data).forEach((itemKey) => {
            if (control == itemKey && control != 'idQuantity') {
              this.productForm
                .get(control)
                ?.setValue(Q[Q.length - 1][control as keyof typeof Q]);
            }
          });
        });
      });

      this.item.getImage(this.item.idProduct)!.then((imageBase64: any) => {
        this.productImageEl = document.getElementById(
          'productImageElt'
        ) as HTMLImageElement;
        this.productImageEl.src = imageBase64;
      });

      this.productForm
        .get('idPrice')
        ?.setValue(this.db.prices.generatePriceId());
      this.productForm
        .get('idQuantity')
        ?.setValue(this.db.quantities.generateQuantityId());
    }

    //populate fields with default data (add)
    if (this.isAdd) {
      this.productForm
        .get('idProduct')
        ?.setValue(this.db.products.generateProductId());
      this.productForm
        .get('idPrice')
        ?.setValue(this.db.prices.generatePriceId());
      this.productForm
        .get('idQuantity')
        ?.setValue(this.db.quantities.generateQuantityId());
      this.getBase64DefaultProductImage();
    }
  }

  async save() {
    if (this.isAdd) {
      if (this.productImageBase64String != '') {
        this.db.products
          .insertProduct(this.productForm.getRawValue())
          .then((p: ProductDocument) => {
            if (p) {
              p.addImage(
                p.idProduct,
                this.productImageBase64String,
                this.productImageType
              ).then(() => {
                this.editModalController.dismiss(null, 'cancel');
              });
              this.db.prices.insertPrice(this.productForm.getRawValue());
              this.db.quantities.insertQuantity(this.productForm.getRawValue());
            } else {
              //error handling
            }
          });
      }
    } else {
      this.db.products
        .updateProduct(this.productForm.getRawValue())
        .then((p: ProductDocument) => {
          if (p) {
            p.addImage(
              p.idProduct,
              this.productImageBase64String,
              this.productImageType
            ).then(() => {
              this.editModalController.dismiss(null, 'cancel');
            });
            this.db.prices.insertPrice(this.productForm.getRawValue());
            this.db.quantities.insertQuantity(this.productForm.getRawValue());
          } else {
            //error handling
          }
        });
    }
  }

  async delete(item: ProductDocument) {
    this.db.products.deleteProduct(item).then(() => {
      this.editModalController.dismiss(null, 'cancel');
    });
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

  calculateProfitMargin(e: any) {
    if (
      this.productForm.get('sellingPrice')?.value != 0 ||
      this.productForm.get('buyingPrice')?.value != 0
    ) {
      this.productForm
        .get('profitMargin')
        ?.setValue(
          this.productForm.get('sellingPrice')?.value -
            this.productForm.get('buyingPrice')?.value
        );
    } else {
      this.productForm.get('profitMargin')?.setValue(0);
    }
  }

  calculateStockQuantity(e: any) {
    if (
      this.productForm.get('supplyQuantity')?.value != 0 ||
      this.productForm.get('soldQuantity')?.value != 0
    ) {
      this.productForm
        .get('stockQuantity')
        ?.setValue(
          this.productForm.get('supplyQuantity')?.value -
            this.productForm.get('soldQuantity')?.value
        );
    } else {
      this.productForm.get('stockQuantity')?.setValue(0);
    }
  }

  changePhoto(imageBase64: any) {
    this.productImageEl = document.getElementById(
      'productImageElt'
    ) as HTMLImageElement;
    this.productImageEl.src = imageBase64;
    this.productImageBase64String = imageBase64;
  }

  close() {
    this.editModalController.dismiss(null, 'cancel');
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

  initializeForms() {
    this.productForm = this.formBuilder.group({
      idProduct: [''],
      idPrice: [''],
      idQuantity: [''],
      name: [''],
      description: [''],
      category: [''],
      conditionningType: [''],
      buyingPrice: [''],
      sellingPrice: [''],
      profitMargin: [{ value: '', disabled: true }],
      profitMarginDate: [],
      stockQuantity: [{ value: '', disabled: true }],
      stockQuantityDate: [],
      supplyQuantity: [''],
      soldQuantity: [''],
    });

    this.productForm.patchValue({
      buyingPrice: 0,
      sellingPrice: 0,
      profitMargin: 0,
      stockQuantity: 0,
      supplyQuantity: 0,
      soldQuantity: 0,
    });
  }
}
