import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/products/tabs/tabs.routes').then((m) => m.routes),
  },
];
