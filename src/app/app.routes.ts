import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './guards/login.guard';
import { emailGuard } from './guards/email.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // {path:"forget-password", component: ContrasenaEmailComponent},
  // {path:"error", component: ErrorServidorComponent,canActivate:[ErrorServidorGuard]},
  // {path:"personal/email-pwd", component: RestablecerContrasenaEmailComponent,canActivate:[EmailGuard]},
  // {path:"usuario", loadChildren:()=>import("./modulo-cliente/modulo-cliente.module").then(m => m.ModuloClienteModule)},

  {
    path: '',
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./components/shared/panel-admin/panel-admin.component'),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/registro-usuario/registro-usuario.component'),
      },
      {
        path: 'ver-usuarios',
        loadComponent: () =>
          import('./pages/ver-usuarios/ver-usuarios.component'),
      },
      {
        path: 'registro-personal',
        loadComponent: () =>
          import('./pages/registro-personal/registro-personal.component'),
      },
      {
        path: 'registro-rol',
        loadComponent: () =>
          import('./pages/registro-rol/registro-rol.component'),
      },
      {
        path: 'ver-personal',
        loadComponent: () =>
          import('./pages/ver-personal/ver-personal.component'),
      },
      {
        path: 'ver-rol',
        loadComponent: () => import('./pages/ver-rol/ver-rol.component'),
      },
      {
        path: 'qr',
        loadComponent: () =>
          import('./pages/escanner-qr/escanner-qr.component'),
      },
      {
        path: 'contrasena',
        loadComponent: () =>
          import('./pages/cambio-contrasena/cambio-contrasena.component'),
      },
      {
        path: 'modulo',
        loadComponent: () => import('./pages/modulos/modulos.component'),
      },
      {
        path: 'permisos/:id',
        loadComponent: () =>
          import('./pages/permissions/permissions.component'),
      },
    ],
  },
  {
    path: 'forget-password',
    loadComponent: () =>
      import('./pages/contrasena-email/contrasena-email.component'),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component'),
    canActivate: [emailGuard],
  },
  { path: '**', redirectTo: '/login' },
];
