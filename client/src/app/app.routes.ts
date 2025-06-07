import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', // Ceci signifie que c'est la route par défaut
    redirectTo: 'login', // Redirige vers la page de connexion
    pathMatch: 'full' // Assure que la redirection se fait uniquement si le chemin est vide
  },
  {
    // C'est ici que tu définis l'URL de ta page de connexion.
    // Si tu veux que l'URL soit '/login', alors laisse 'path: 'login''.
    // Si la page qui contient ton formulaire de connexion est celle qui est actuellement générée sous 'home',
    // alors tu dois pointer vers le composant de 'home'.
    path: 'login', // L'URL que tu veux afficher dans le navigateur pour la page de connexion
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
    // Ici, nous importons le composant de la page 'home' et spécifions la classe 'LoginPage'.
    // Cela signifie que lorsque l'URL est '/login', c'est le composant 'LoginPage' qui sera affiché.
  },
  // Si tu as d'autres routes existantes, laisse-les ici
  // Par exemple, si tu avais une "vraie" page d'accueil qui n'est pas la connexion:
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  // },
  // ...
];