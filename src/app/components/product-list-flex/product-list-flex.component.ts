import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonCard } from '@ionic/angular/standalone';
import { ProductDocument } from 'src/app/types/app.types';

@Component({
  selector: 'app-product-list-flex',
  templateUrl: './product-list-flex.component.html',
  styleUrls: ['./product-list-flex.component.scss'],
  standalone: true,
  imports: [IonCard, CommonModule]
})
export class ProductListFlexComponent  implements OnInit {
  @Input() items!: ProductDocument[];

  constructor() { }

  ngOnInit() {}

}
