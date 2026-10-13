
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'contacts',
    pathMatch: 'full'
  },
  {
    path: 'contacts',
    loadComponent: () =>
      import('./pages/contact-management/contact-management')
        .then(m => m.ContactManagement)
  },
  {
    path: 'message-editor',
    loadComponent: () =>
      import('./pages/message-editor/message-editor')
        .then(m => m.MessageEditor)
  },
  {
    path: '**',
    redirectTo: 'contacts'
  }
];

