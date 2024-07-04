import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  OnInit,
  Renderer2,
} from '@angular/core';
import {
  IonCard,
  IonThumbnail,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonModal,
  IonToolbar,
  IonButtons,
  IonButton,
  IonHeader,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { LongpressDirective } from 'src/app/directives/longpress.directive';
import { ProductDocument } from 'src/app/types/products.types';
import 'animate.css';

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
    IonThumbnail,
    IonModal,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardContent,
    LongpressDirective,
    CommonModule,
  ],
})
export class ProductCardComponent implements OnInit {
  @Input() item!: ProductDocument;
  @Input() cardId!: string;
  @Output() shortPress = new EventEmitter();
  @Output() longPress = new EventEmitter();

  productImage: string = '../../../assets/images/products.png';
  selectedCard: boolean = false;

  constructor() {}

  ngOnInit() {
    this.item.getImage(this.item.id).then((image) => {
      this.productImage = image;
    });
    this.selectedCard = false;
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
