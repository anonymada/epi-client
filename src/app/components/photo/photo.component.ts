import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
  IonContent,
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { camera } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, IonFabButton, IonFab, CommonModule],
})
export class PhotoComponent {
  @Output() newPhoto = new EventEmitter<string>();
  @Input() fabTitle: string = '';

  constructor() {
    addIcons({ camera });
  }

  addPhoto() {
    Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      promptLabelHeader: 'Image du Produit',
      promptLabelPhoto: 'Gallerie',
      promptLabelPicture: 'Appareil photo',
      promptLabelCancel: 'Annuler',
      quality: 100,
      height: 75,
      width: 75,
    })
      .then((photo) => {
        this.newPhoto.emit(photo.dataUrl);
      })
      .catch((Error) => {
        console.log(Error);
      });
  }
}
