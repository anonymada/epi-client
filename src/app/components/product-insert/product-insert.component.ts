import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.scss'],
  standalone: true,
  imports: [IonButton, IonInput, ReactiveFormsModule],
})
export class ProductInsertComponent implements OnInit {
  productForm!: FormGroup;

  constructor(
    private databaseService: DatabaseService,
    private formBuilder: FormBuilder
  ) {
    this.productForm = this.formBuilder.group({
      id: [''],
      name: [''],
    });
  }

  ngOnInit() {
    console.warn('');
  }

  async submit() {
    const db = await this.databaseService.get();
    db['products'].insert(this.productForm.getRawValue());
  }
}
