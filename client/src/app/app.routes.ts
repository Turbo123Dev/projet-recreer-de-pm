import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // Chemin par défaut
    redirectTo: 'login', // Redirige vers la page de connexion au démarrage
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./inscription/inscription.component').then(m => m.InscriptionComponent)
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () => import('./mot-de-passe-oublie/mot-de-passe-oublie.page').then(m => m.MotDePasseOubliePage)
  },
  // Ajoutez d'autres routes ici si nécessaire
];