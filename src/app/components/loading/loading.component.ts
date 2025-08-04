import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonSpinner,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container" [ngClass]="{'overlay': overlay}">
      <div class="loading-content">
        <ion-spinner [name]="spinnerType" [color]="color"></ion-spinner>
        <ion-label *ngIf="message" class="loading-message">
          {{ message }}
        </ion-label>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .loading-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .loading-message {
      text-align: center;
      font-size: 14px;
    }

    .overlay .loading-content {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
  `],
  standalone: true,
  imports: [CommonModule, IonSpinner, IonLabel]
})
export class LoadingComponent {
  @Input() message?: string;
  @Input() overlay: boolean = false;
  @Input() spinnerType: string = 'circles';
  @Input() color: string = 'primary';
}