import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ErrorToastComponent } from './components/error-toast/error-toast.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, ErrorToastComponent],
})
export class AppComponent {
  constructor() {}
}
