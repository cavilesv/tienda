import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'inicio',
    loadChildren: () => import('./Inicio/inicio.routes').then((m) => m.routes),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./Dashboard/dashboard.routes').then((m) => m.routes),
    canActivate: [authGuard]
  },
  {
    path: '',
    loadChildren: () => import('./Inicio/inicio.routes').then((m) => m.routes)
  }
];
