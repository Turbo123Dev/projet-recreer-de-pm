import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // Route par défaut qui redirige vers 'login'
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    // Route pour la page de connexion (URL: /login)
    // Assurez-vous que le chemin d'importation correspond à l'emplacement réel de votre dossier 'login'.
    // Si 'login.page.ts' est dans client/src/app/login/, alors './login/login.page' est correct.
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    // Route pour la page d'inscription (URL: /inscription)
    // Assurez-vous que le chemin d'importation correspond à l'emplacement réel de votre dossier 'inscription'.
    // Si 'inscription.page.ts' est dans client/src/app/inscription/, alors './inscription/inscription.page' est correct.
     path: 'inscription',
  loadComponent: () => import('./inscription/inscription.component').then(m => m.InscriptionComponent)
  
  },
  {
    // Route pour la page du tableau de bord (URL: /dashboard)
    // Assurez-vous que le chemin d'importation correspond à l'emplacement réel de votre dossier 'dashboard'.
    // Si 'dashboard.page.ts' est dans client/src/app/dashboard/, alors './dashboard/dashboard.page' est correct.
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  },
]