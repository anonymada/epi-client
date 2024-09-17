import { Component, Input, OnInit } from '@angular/core';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { KebabMenuComponent } from '../kebab-menu/kebab-menu.component';
import { I18NComponent } from '../i18-n/i18-n.component';

@Component({
  selector: 'app-hearder',
  templateUrl: './hearder.component.html',
  styleUrls: ['./hearder.component.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonHeader,
    IonTitle,
    IonToolbar,
    TranslateModule,
    KebabMenuComponent,
    I18NComponent,
  ],
})
export class HearderComponent implements OnInit {
  @Input() pageTitle!: string;
  constructor() {}

  ngOnInit() {}
}
