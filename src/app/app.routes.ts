import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'supervisor',
    loadComponent: () => import('./pages/supervisor/supervisor.page').then(m => m.SupervisorPage)
  },
  {
    path: 'tecnico',
    loadComponent: () => import('./pages/tecnico/tecnico.page').then(m => m.TecnicoPage)
  },
  {
    path: 'crear-tarea',
    loadComponent: () => import('./pages/crear-tarea/crear-tarea.page').then(m => m.CrearTareaPage)
  },
  {
    path: 'ver-reportes',
    loadComponent: () => import('./pages/ver-reportes/ver-reportes.page').then(m => m.VerReportesPage)
  },
  {
    path: 'gestion-usuarios',
    loadComponent: () => import('./pages/gestion-usuarios/gestion-usuarios.page').then(m => m.GestionUsuariosPage)
  },
  {
    path: 'crear-informes',
    loadComponent: () => import('./pages/crear-informes/crear-informes.page').then(m => m.CrearInformesPage)
  }
];
