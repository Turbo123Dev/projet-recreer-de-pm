import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'feedback', // Cette ligne devrait avoir été ajoutée
    loadComponent: () => import('./feedback/feedback.page').then(m => m.FeedbackPage)
  },
];
