import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  ModalController
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { warningOutline, checkmarkCircle } from 'ionicons/icons';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>{{ title | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-content class="ion-padding">
      <div class="confirm-content">
        <div class="icon-container">
          <ion-icon 
            [name]="type === 'danger' ? 'warning-outline' : 'checkmark-circle'" 
            [color]="type === 'danger' ? 'danger' : 'warning'"
            size="large">
          </ion-icon>
        </div>
        
        <p class="message">{{ message | translate }}</p>
        
        <div class="button-container">
          <ion-button 
            fill="outline" 
            color="medium" 
            (click)="dismiss(false)">
            {{ cancelText | translate }}
          </ion-button>
          
          <ion-button 
            [color]="type === 'danger' ? 'danger' : 'primary'" 
            (click)="dismiss(true)">
            {{ confirmText | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .confirm-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 20px;
      padding: 20px 0;
    }

    .icon-container {
      margin: 20px 0;
    }

    .message {
      font-size: 16px;
      line-height: 1.5;
      margin: 0;
      max-width: 300px;
    }

    .button-container {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }

    .button-container ion-button {
      min-width: 100px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    TranslateModule
  ]
})
export class ConfirmDialogComponent {
  @Input() title: string = 'GLOBAL.CONFIRM';
  @Input() message: string = '';
  @Input() confirmText: string = 'GLOBAL.CONFIRM';
  @Input() cancelText: string = 'GLOBAL.CANCEL';
  @Input() type: 'warning' | 'danger' = 'warning';

  constructor(private modalController: ModalController) {
    addIcons({ warningOutline, checkmarkCircle });
  }

  dismiss(confirmed: boolean) {
    this.modalController.dismiss(confirmed);
  }
}