import { Routes } from '@angular/router';
import { InicioComponent } from './inicio.page';
import { LoginComponent } from './Login/login.component';


export const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./Login/login.component').then((m) => m.LoginComponent)
      },
      {
        path: 'registro',
        loadComponent: () =>
          import('./Registro/registro.component').then((m) => m.RegistroComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
];
