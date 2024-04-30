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
import { create, trash, add } from 'ionicons/icons';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, IonIcon, CdkDrag],
})
export class ProductsListComponent implements OnInit, OnDestroy {
  products!: any[];
  subscribable!: any;

  @Output() productsList: EventEmitter<RxDocument> = new EventEmitter();

  editProduct(product: any) {
    this.productsList.emit(product);
  }

  deleteProduct(product: any) {
    product.remove();
  }

  constructor(private databaseService: DatabaseService, private zone: NgZone) {
    addIcons({ create, trash, add });
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

  onPress(event: any) {
    console.log('press: ', event);
  }

  onSwipe(event: any) {
    console.log(event);
  }
}
