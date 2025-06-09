import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/chat',
    pathMatch: 'full',
  },
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  // },
  {
    path: 'chat',
    children: [
      {
        path: '',
        loadComponent: () => import('./chat/tutors-list/tutors-list.page').then(m => m.TutorsListPage)
      },
      {
        path: 'conversation/:tutorId',
        loadComponent: () => import('./chat/conversation/conversation.page').then(m => m.ConversationPage)
      }
    ]
  },
  {
    path: 'tutors-list',
    loadComponent: () => import('./chat/tutors-list/tutors-list.page').then( m => m.TutorsListPage)
  },
  {
    path: 'conversation',
    loadComponent: () => import('./chat/conversation/conversation.page').then( m => m.ConversationPage)
  }

];