import { Component, EnvironmentInjector, inject } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { storefront, business } from 'ionicons/icons';
import { HearderComponent } from 'src/app/components/hearder/hearder.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    TranslateModule,
    HearderComponent,
  ],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  currentTitle: any;

  constructor() {
    addIcons({ storefront, business });
  }

  onTabChange(event: any) {
    const selectedTab = event.tab;
    switch (selectedTab) {
      case 'tab1':
        this.currentTitle = 'PRODUCT.PRODUCTS';
        break;
      case 'tab2':
        this.currentTitle = 'GLOBAL.HOME';
        break;
      default:
        this.currentTitle = 'TSeNAKO';
        break;
    }
  }
}
