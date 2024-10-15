import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('popover') popover: { event: Event } | undefined;
  isOpen = false;

  constructor() {
    addIcons({
      ellipsisVertical,
    });
  }

  ngOnInit() {}

  presentPopover(e: Event) {
    this.popover!.event = e;
    this.isOpen = true;
  }
}
