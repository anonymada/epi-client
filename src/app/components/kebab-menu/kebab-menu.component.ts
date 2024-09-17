import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonPopover,
  IonContent,
  IonIcon,
  IonList,
  IonItem,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVertical } from 'ionicons/icons';
import { I18NComponent } from '../i18-n/i18-n.component';

@Component({
  selector: 'app-kebab-menu',
  templateUrl: './kebab-menu.component.html',
  styleUrls: ['./kebab-menu.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonList,
    IonIcon,
    IonContent,
    IonButton,
    IonPopover,
    I18NComponent,
  ],
})
export class KebabMenuComponent implements OnInit {
  constructor() {
    addIcons({
      ellipsisVertical,
    });
  }

  ngOnInit() {}
}
