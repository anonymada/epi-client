import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ProductValidators {
  
  /**
   * Validateur pour le nom du produit
   */
  static productName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null; // Laisse le validateur required gérer les valeurs vides
      }

      // Minimum 2 caractères
      if (value.length < 2) {
        return { minLength: { requiredLength: 2, actualLength: value.length } };
      }

      // Maximum 100 caractères
      if (value.length > 100) {
        return { maxLength: { requiredLength: 100, actualLength: value.length } };
      }

      // Caractères autorisés (lettres, chiffres, espaces, tirets)
      const validPattern = /^[a-zA-Z0-9\s\-àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]+$/;
      if (!validPattern.test(value)) {
        return { invalidCharacters: true };
      }

      return null;
    };
  }

  /**
   * Validateur pour les prix
   */
  static price(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value && value !== 0) {
        return null;
      }

      const numValue = parseFloat(value);

      // Doit être un nombre
      if (isNaN(numValue)) {
        return { notANumber: true };
      }

      // Doit être positif
      if (numValue < 0) {
        return { negative: true };
      }

      // Maximum raisonnable
      if (numValue > 999999999) {
        return { tooLarge: true };
      }

      return null;
    };
  }

  /**
   * Validateur pour les quantités
   */
  static quantity(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value && value !== 0) {
        return null;
      }

      const numValue = parseFloat(value);

      // Doit être un nombre
      if (isNaN(numValue)) {
        return { notANumber: true };
      }

      // Doit être positif ou zéro
      if (numValue < 0) {
        return { negative: true };
      }

      // Doit être un entier pour les quantités
      if (!Number.isInteger(numValue)) {
        return { notInteger: true };
      }

      return null;
    };
  }

  /**
   * Validateur pour la catégorie
   */
  static category(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }

      // Minimum 2 caractères
      if (value.length < 2) {
        return { minLength: { requiredLength: 2, actualLength: value.length } };
      }

      // Maximum 50 caractères
      if (value.length > 50) {
        return { maxLength: { requiredLength: 50, actualLength: value.length } };
      }

      return null;
    };
  }

  /**
   * Validateur pour vérifier que le prix de vente est supérieur au prix d'achat
   */
  static sellingPriceGreaterThanBuying(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      
      if (!formGroup) {
        return null;
      }

      const buyingPrice = formGroup.get('buyingPrice')?.value;
      const sellingPrice = control.value;

      if (!buyingPrice || !sellingPrice) {
        return null;
      }

      const buying = parseFloat(buyingPrice);
      const selling = parseFloat(sellingPrice);

      if (selling <= buying) {
        return { sellingPriceTooLow: true };
      }

      return null;
    };
  }

  /**
   * Validateur pour vérifier que la quantité en stock est inférieure à la quantité commandée
   */
  static stockQuantityValid(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      
      if (!formGroup) {
        return null;
      }

      const supplyQuantity = formGroup.get('supplyQuantity')?.value;
      const stockQuantity = control.value;

      if (!supplyQuantity || !stockQuantity) {
        return null;
      }

      const supply = parseFloat(supplyQuantity);
      const stock = parseFloat(stockQuantity);

      if (stock > supply) {
        return { stockQuantityTooHigh: true };
      }

      return null;
    };
  }
}