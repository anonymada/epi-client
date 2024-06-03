import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
} from '@angular/core';
import {
  GestureController,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCardContent,
  ],
})
export class ProductCardComponent implements AfterViewInit {
  @ViewChild('card', { read: ElementRef })
  card!: ElementRef<HTMLIonCardElement>;
  @Input() productName: any;
  @Input() productPrice: any;

  private currentOffset: number = 0;
  private lastOnStart: number = 0;
  private DOUBLE_CLICK_THRESHOLD: number = 500;

  constructor(private el: ElementRef, private gestureCtrl: GestureController) {}

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.card.nativeElement,
      threshold: 0,
      onStart: () => this.onStart(),
      gestureName: 'double-click',
    });

    gesture.enable();
  }

  private onStart() {
    const now = Date.now();

    if (Math.abs(now - this.lastOnStart) <= this.DOUBLE_CLICK_THRESHOLD) {
      this.card.nativeElement.style.setProperty(
        'transform',
        this.getNewTransform()
      );
      this.lastOnStart = 0;
    } else {
      this.lastOnStart = now;
    }
  }

  private getNewTransform() {
    if (this.currentOffset >= 100) {
      this.currentOffset = 0;
    } else {
      this.currentOffset += 20;
    }

    return `translateX(${this.currentOffset}px)`;
  }
}
