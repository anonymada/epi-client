import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, FormsModule, CommonModule],
})
export class CustomSelectComponent {
  @Input() options: string[] = []; // Les options existantes
  @Input() label: string = ''; // L'étiquette du champ
  @Output() selectionChange = new EventEmitter<string>(); // Événement de sélection

  selectedOption: string = '';
  filteredOptions: string[] = [];
  showDatalist: boolean = false;

  constructor() {}

  // Filtrer les options en fonction de l'entrée
  onInputChange() {
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(this.selectedOption.toLowerCase())
    );
    this.showDatalist =
      this.selectedOption.trim() !== '' && this.filteredOptions.length > 0;
  }

  // Sélectionner une option dans la liste
  selectOption(option: string) {
    this.selectedOption = option;
    this.showDatalist = false;
    this.emitSelection();
  }

  // Ajouter une nouvelle option
  addNewOption() {
    if (this.selectedOption && !this.options.includes(this.selectedOption)) {
      this.options.push(this.selectedOption);
      this.showDatalist = false;
      this.emitSelection();
    }
  }

  // Émettre l'événement de sélection
  emitSelection() {
    this.selectionChange.emit(this.selectedOption);
  }
}
