import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  IonToast,
  ToastController
} from '@ionic/angular/standalone';
import { ErrorHandlingService, AppError } from '../../services/error-handling.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-error-toast',
  template: ``,
  standalone: true,
  imports: [CommonModule, IonToast, TranslateModule]
})
export class ErrorToastComponent implements OnInit, OnDestroy {
  private subscription?: Subscription;

  constructor(
    private errorHandler: ErrorHandlingService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.subscription = this.errorHandler.errors$.subscribe(errors => {
      const latestError = errors[errors.length - 1];
      if (latestError) {
        this.showToast(latestError);
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private async showToast(error: AppError) {
    const toast = await this.toastController.create({
      message: error.message,
      duration: error.type === 'error' ? 0 : 3000,
      position: 'top',
      color: this.getToastColor(error.type),
      buttons: error.type === 'error' ? [
        {
          text: 'Fermer',
          role: 'cancel',
          handler: () => {
            this.errorHandler.removeError(error.id);
          }
        }
      ] : undefined
    });

    await toast.present();

    if (error.type !== 'error') {
      setTimeout(() => {
        this.errorHandler.removeError(error.id);
      }, 3000);
    }
  }

  private getToastColor(type: string): string {
    switch (type) {
      case 'error': return 'danger';
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'info': return 'primary';
      default: return 'medium';
    }
  }
}