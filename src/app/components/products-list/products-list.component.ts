import {
  Component,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
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
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, trash } from 'ionicons/icons';
import { ProductDocument } from 'src/app/types/products.types';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports: [
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    CommonModule,
    IonCol,
    IonRow,
    IonGrid,
    IonIcon,
    IonSpinner,
  ],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products!: any[];
  trashbin: any[] = [1];
  subscribable!: any;
  isTrashVisible: boolean = false;

  @Output() productsList: EventEmitter<ProductDocument> = new EventEmitter();

  editProduct(product: ProductDocument) {
    this.productsList.emit(product);
  }

  constructor(private databaseService: DatabaseService, private zone: NgZone) {
    addIcons({ create, trash });
  }

  ngOnInit() {
    this._listAllProducts();
  }

  private async _listAllProducts() {
    const db = await this.databaseService.get();
    const products$ = db['products'].find().$;
    this.subscribable = products$.subscribe((products: any) => {
      this.products = products;
      this.zone.run(() => {});
    });
  }

  ngOnDestroy(): void {
    this.subscribable.unsubscribe();
  }

  showTrash() {
    this.isTrashVisible = true;
  }

  hideTrash() {
    this.isTrashVisible = false;
  }

  colorTrash() {
    console.log('entered');
  }
}
