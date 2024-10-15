import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonToolbar,
  IonCol,
  IonRow,
  IonGrid,
  IonHeader,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { HearderComponent } from '../../../components/hearder/hearder.component';
import { DatabaseService } from 'src/app/services/database.service';
import { ProductDocument } from 'src/app/types/app.types';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    HearderComponent,
    TranslateModule,
    CommonModule,
  ],
})
export class Tab2Page {
  productsNumber: number = 0;
  productsMarketValue: number = 0;
  priceChart: any;
  stockChart: any;
  db: any;

  constructor(private databaseService: DatabaseService) {
    // Enregistrement des composants nécessaires de Chart.js
    Chart.register(...registerables);
  }

  async ngOnInit() {
    this.db = await this.databaseService.get();
    this.db.products
      .listAllProducts()
      .subscribe(async (p: ProductDocument[]) => {
        this.productsNumber = p.length;
        this.productsMarketValue = await this.calculateProductsMarketValue(p);
      });

    this.createPriceChart();
    this.createStockChart();
  }

  // Création du graphique d'évolution des prix
  createPriceChart() {
    const ctx = document.getElementById('priceChart') as HTMLCanvasElement;
    this.priceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Les mois
        datasets: [
          {
            label: 'Évolution des prix',
            data: [10, 12, 8, 14, 15, 10, 16], // Exemple de données
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Création du graphique d'évolution des stocks
  createStockChart() {
    const ctx = document.getElementById('stockChart') as HTMLCanvasElement;
    this.stockChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Les mois
        datasets: [
          {
            label: 'Évolution des stocks',
            data: [50, 60, 40, 80, 45, 90, 100], // Exemple de données
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  //calculate the total amount of stock
  async calculateProductsMarketValue(p: ProductDocument[]): Promise<number> {
    const result = await Promise.all(
      p.map(
        async (product) =>
          (
            await this.db.prices.getProductPrices(product)
          )[(await this.db.prices.getProductPrices(product)).length - 1][
            'sellingPrice'
          ] *
          (
            await this.db.quantities.getProductQuantities(product)
          )[
            (await this.db.quantities.getProductQuantities(product)).length - 1
          ]['stockQuantity']
      )
    );
    return result.reduce((acc, num) => acc + num, 0);
  }
}
