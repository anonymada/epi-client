import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonCard, IonIcon } from '@ionic/angular/standalone';
import { ProductDocument } from 'src/app/types/app.types';

@Component({
  selector: 'app-product-list-grid',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list-grid.component.scss'],
  imports: [ IonCard, IonIcon, CommonModule ],
  standalone: true,
})
export class ProductListGridComponent  implements OnInit {
  @Input() items!: ProductDocument[];
  public dataTest = [1, 2, 3, 4, 5, 6];

  constructor() { }

  ngOnInit() {}

}
