import {
  Component,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { RxDocument } from 'rxdb';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, trash } from 'ionicons/icons';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { ProductDocument } from 'src/app/types/products.types';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, IonIcon, CdkDrag, CdkDropList],
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

  dropToDelete(event: CdkDragDrop<ProductDocument[]>) {
    if (event.previousContainer === event.container) {
      this.hideTrash();
    } else {
      event.item.data.remove();
      this.hideTrash();
    }
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
