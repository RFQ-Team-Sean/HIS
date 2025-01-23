import { Routes } from '@angular/router';

// Core Components
import { ADashboardComponent } from './features/systems-admin/dashboard/dashboard.component';
import { LoginLayoutComponent } from './features/auth/login-layout/login-layout.component';
import { LayoutComponent } from './shared/layout/layout.component';

// Feature Components
import { SystemsConfigComponent } from './features/systems-admin/systems-config/systems-config.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginLayoutComponent
  },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ADashboardComponent },
      
      { path: 'systems-config', component: SystemsConfigComponent },
      
    ]
  },

  {
    path: '**', // Wildcard route
    redirectTo: '/login',
  },
];