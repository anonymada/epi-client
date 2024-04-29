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

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, IonIcon],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products!: any[];
  sub!: any;

  @Output() productsList: EventEmitter<RxDocument> = new EventEmitter();

  set edit(product: any) {
    this.productsList.emit(product);
  }

  editProduct(product: any) {
    this.edit = product;
  }

  deleteProduct(product: any) {
    product.remove();
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
    this.sub = products$.subscribe((products: any) => {
      this.products = products;
      this.zone.run(() => {});
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
