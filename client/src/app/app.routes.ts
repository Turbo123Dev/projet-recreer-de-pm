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
    loadComponent: () => import('./inscription/inscription.component').then(m => m.InscriptionComponent) // Assurez-vous que le chemin est correct ici, j'ai mis 'input' comme exemple
  },
  {
    path: 'mot-de-passe-oublie',
    loadComponent: () => import('./mot-de-passe-oublie/mot-de-passe-oublie.page').then(m => m.MotDePasseOubliePage)
  },
  {
    path: 'dashboard', // <-- NOUVEAU : C'est la route de votre tableau de bord
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage) // <-- IMPORTANT : Mettez le chemin et le nom de la classe de votre composant de tableau de bord
  },
  {
    path: 'request-session',
    loadComponent: () => import('./request-session/request-session.page').then( m => m.RequestSessionPage)
  },
  // Ajoutez d'autres routes ici si nécessaire
];