import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  IonCard,
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
export class ProductCardComponent {
  @ViewChild('card', { read: ElementRef })
  card!: ElementRef<HTMLIonCardElement>;
  @Input() item: any;
  @Output() LongPress = new EventEmitter();

  constructor(private el: ElementRef) {}

  onLongPress() {
    this.LongPress.emit();
  }
}
