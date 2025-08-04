import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'success';
  timestamp: Date;
  context?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  private errorsSubject = new BehaviorSubject<AppError[]>([]);
  public errors$ = this.errorsSubject.asObservable();

  constructor() {}

  handleError(error: any, context?: string): void {
    const appError: AppError = {
      id: this.generateId(),
      message: this.extractErrorMessage(error),
      type: 'error',
      timestamp: new Date(),
      context: context
    };

    console.error('Application Error:', appError);
    this.addError(appError);
  }

  handleSuccess(message: string): void {
    const successMessage: AppError = {
      id: this.generateId(),
      message,
      type: 'success',
      timestamp: new Date()
    };

    this.addError(successMessage);
  }

  handleWarning(message: string, context?: any): void {
    const warning: AppError = {
      id: this.generateId(),
      message,
      type: 'warning',
      timestamp: new Date(),
      context
    };

    this.addError(warning);
  }

  private addError(error: AppError): void {
    const currentErrors = this.errorsSubject.value;
    this.errorsSubject.next([...currentErrors, error]);

    // Auto-remove after 5 seconds for non-error types
    if (error.type !== 'error') {
      setTimeout(() => {
        this.removeError(error.id);
      }, 5000);
    }
  }

  removeError(id: string): void {
    const currentErrors = this.errorsSubject.value;
    const filteredErrors = currentErrors.filter(error => error.id !== id);
    this.errorsSubject.next(filteredErrors);
  }

  clearAllErrors(): void {
    this.errorsSubject.next([]);
  }

  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.error?.message) {
      return error.error.message;
    }
    
    return 'Une erreur inattendue s\'est produite';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}