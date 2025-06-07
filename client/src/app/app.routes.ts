// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'inscription', 
    loadComponent: () => import('./inscription/inscription.component').then((m) => m.InscriptionComponent), 
  },
  {
    path: '',
    redirectTo: 'inscription',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
];