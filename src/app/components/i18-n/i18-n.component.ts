import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  IonButton,
  IonPopover,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-i18-n',
  templateUrl: './i18-n.component.html',
  styleUrls: ['./i18-n.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonItem,
    IonList,
    IonContent,
    IonPopover,
    IonButton,
    CommonModule,
    TranslateModule,
  ],
})
export class I18NComponent implements OnInit {
  @ViewChild('popover') popover: { event: Event } | undefined;
  isOpen = false;
  langDict = {
    fr: 'GLOBAL.FRENCH',
    mg: 'GLOBAL.MALAGASY',
  };

  langSelected: any;

  constructor(public translate: TranslateService) {
    console.log(this.langSelected);
  }

  ngOnInit(): void {
    if (localStorage['language'] == undefined) {
      this.langPicker('fr');
    } else {
      this.langPicker(localStorage['language']);
    }
  }

  langPicker(lang: any) {
    this.translate.use(lang);
    this.langSelected = lang;
    localStorage['language'] = lang;
  }

  presentPopover(e: Event) {
    this.popover!.event = e;
    this.isOpen = true;
  }
}
