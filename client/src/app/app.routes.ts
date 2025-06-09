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
  // Routes existantes pour le chat
  {
    path: 'chat',
    loadComponent: () => import('./chat/chat.page').then(m => m.ChatPage)
  },
  {
    path: 'chat/:tutorId',
    loadComponent: () => import('./chat/chat.page').then(m => m.ChatPage)
  },
  // NOUVELLE ROUTE POUR LE FEEDBACK
  {
    path: 'feedback', // Route pour la page de feedback
    loadComponent: () => import('./feedback/feedback.page').then(m => m.FeedbackPage)
  },
  // Ajoutez d'autres routes ici si nécessaire
];