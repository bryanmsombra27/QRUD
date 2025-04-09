import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { loginGuard } from './guards/login.guard';

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
      // {path:"ver-rol", component:VerRolComponent},
      // {path:"usuarios-eliminados", component:UsuariosEliminadosComponent },
      // {path:"personal-eliminado", component:PersonalEliminadoComponent },
      // {path:"qr", component:EscannerQRComponent},
      // {path:"contrasena", component:CambioContrasenaComponent},
    ],
  },
  { path: '**', redirectTo: '' },
];
