import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { DatabaseService } from 'src/app/services/database.service';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import {
  ModalController,
  IonIcon,
  IonButton,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { ProductDocument } from 'src/app/types/app.types';
import { TranslateModule } from '@ngx-translate/core';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

@Component({
  selector: 'app-product-stats',
  templateUrl: './product-stats.component.html',
  styleUrls: ['./product-stats.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IonIcon,
    IonButton,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonSelect,
    IonSelectOption,
    FormsModule,
  ],
})
export class ProductStatsComponent implements OnInit {
  @Input() item!: ProductDocument;
  profitMarginPercent: number = 0;
  productStockValue: number = 0;
  productChart: any;
  stockQuantity: number = 0;
  db: any;
  selectedValue = 'soldQuantity';

  constructor(
    private statsModalController: ModalController,
    private databaseService: DatabaseService
  ) {
    Chart.register(...registerables);
    addIcons({ arrowBack });
  }

  async ngOnInit() {
    this.db = await this.databaseService.get();

    this.productStockValue = await this.calculateStockValue(this.item);
    this.profitMarginPercent = await this.calulateProfitMarginPercent(
      this.item
    );

    //la dernière quantité en stock
    this.stockQuantity = (
      await this.db.quantities.getProductQuantities(this.item)
    )[(await this.db.quantities.getProductQuantities(this.item)).length - 1][
      'stockQuantity'
    ];
  }

  close() {
    this.statsModalController.dismiss(null, 'cancel');
  }

  displayChartChange(event: CustomEvent) {
    if (event.detail.value === 'price') {
      this.db.prices.getProductPrices(this.item).then(async (p: any) => {
        const x = await p.map((P: { [x: string]: any }) =>
          this.formatDateFromTimestamp(P['priceRegisteredDate'])
        );
        const y = await p.map((P: { [x: string]: any }) => P['sellingPrice']);
        this.createChart(x, y);
      });
    }
    if (event.detail.value === 'soldQuantity') {
      this.db.quantities
        .getProductQuantities(this.item)
        .then(async (p: any) => {
          const x = await p.map((P: { [x: string]: any }) =>
            this.formatDateFromTimestamp(P['quantityRegisteredDate'])
          );
          const y = await p.map((P: { [x: string]: any }) => P['soldQuantity']);

          this.createChart(x, y);
        });
    }
  }
  // Création du graphique d'évolution
  createChart(X: any, Y: any) {
    const ctx = document.getElementById('productChart') as HTMLCanvasElement;
    if (this.productChart) {
      this.productChart.destroy();
    }
    this.productChart = new Chart(ctx, {
      type: 'line', // Type de graphique (ici une courbe)
      data: {
        labels: X,
        datasets: [
          {
            data: Y,
            borderColor: 'blue',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time', // Type d'axe temporel
            time: {
              unit: 'day', // Choisir l'unité de temps (par exemple, jour, mois, année)
              displayFormats: {
                day: 'MMM d', // Format affiché sur l'axe des abscisses
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  async calculateStockValue(p: ProductDocument): Promise<number> {
    const result =
      (await this.db.prices.getProductPrices(p))[
        (await this.db.prices.getProductPrices(p)).length - 1
      ]['buyingPrice'] *
      (await this.db.quantities.getProductQuantities(p))[
        (await this.db.quantities.getProductQuantities(p)).length - 1
      ]['stockQuantity'];

    return result;
  }

  async calulateProfitMarginPercent(p: ProductDocument): Promise<number> {
    const result =
      (((await this.db.prices.getProductPrices(p))[
        (await this.db.prices.getProductPrices(p)).length - 1
      ]['sellingPrice'] -
        (await this.db.prices.getProductPrices(p))[
          (await this.db.prices.getProductPrices(p)).length - 1
        ]['buyingPrice']) /
        (await this.db.prices.getProductPrices(p))[
          (await this.db.prices.getProductPrices(p)).length - 1
        ]['sellingPrice']) *
      100;

    return Math.round(result);
  }

  range(start: number, end: number, step: number = 1): number[] {
    const result = [];
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
    return result;
  }

  formatDateFromTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
