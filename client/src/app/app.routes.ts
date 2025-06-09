import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'request-session',
    loadComponent: () => import('./request-session/request-session.page').then( m => m.RequestSessionPage)
  },
  // NOUVELLES ROUTES POUR LE CHAT
  {
    path: 'chat', // Route pour un chat général (sans ID de tuteur spécifique)
    loadComponent: () => import('./chat/chat.page').then(m => m.ChatPage)
  },
  {
    path: 'chat/:tutorId', // Route pour un chat spécifique avec un tuteur (ID passé en paramètre)
    loadComponent: () => import('./chat/chat.page').then(m => m.ChatPage)
  },
  // Ajoutez d'autres routes ici si nécessaire
];