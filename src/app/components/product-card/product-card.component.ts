import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  IonCard,
  IonThumbnail,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonModal,
  IonToolbar,
  IonBadge,
  IonLabel,
  IonButtons,
  IonButton,
  IonHeader,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { LongpressDirective } from 'src/app/directives/longpress.directive';
import { ProductDocument } from 'src/app/types/app.types';
import 'animate.css';
import { DatabaseService } from 'src/app/services/database.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    IonHeader,
    IonButton,
    IonButtons,
    IonToolbar,
    IonBadge,
    IonLabel,
    IonThumbnail,
    IonModal,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardContent,
    LongpressDirective,
    CommonModule,
    TranslateModule,
  ],
})
export class ProductCardComponent implements OnInit {
  @Input() item!: ProductDocument;
  @Input() cardId!: string;
  @Output() shortPress = new EventEmitter();
  @Output() longPress = new EventEmitter();
  db: any;
  sellingPrice: number = 0;
  stockQuantity: number = 0;

  productImage: string = '../../../assets/images/products.png';
  selectedCard: boolean = false;

  constructor(private databaseService: DatabaseService) {}

  async ngOnInit() {
    this.db = await this.databaseService.get();
    this.item.getImage(this.item.idProduct).then((image) => {
      this.productImage = image;
    });
    this.selectedCard = false;

    //le dernier prix enregistré
    this.sellingPrice = (await this.db.prices.getProductPrices(this.item))[
      (await this.db.prices.getProductPrices(this.item)).length - 1
    ]['sellingPrice'];

    //la dernière quantité en stock
    this.stockQuantity = (
      await this.db.quantities.getProductQuantities(this.item)
    )[(await this.db.quantities.getProductQuantities(this.item)).length - 1][
      'stockQuantity'
    ];
  }

  onPress() {
    this.shortPress.emit();
  }

  onLongPress() {
    if (!this.selectedCard) {
      this.selectedCard = true;
    } else {
      this.selectedCard = false;
    }
    this.longPress.emit();
  }
}
