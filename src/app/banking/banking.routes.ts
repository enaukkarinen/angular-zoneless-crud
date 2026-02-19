import { Routes } from '@angular/router';

import { provideBankingFeature } from '@app/banking/core/provide-banking-feature';
export const bankingRoutes: Routes = [
  {
    path: '',
    providers: [provideBankingFeature()],
    loadComponent: () => import('./banking.component').then((m) => m.BankingComponent),
  },
];
