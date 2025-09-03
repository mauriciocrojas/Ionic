import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Inicio: splash animado
  { path: '', loadChildren: () => import('./pages/splash-anim/splash-anim.module').then(m => m.SplashAnimPageModule) },

  // Otras páginas
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'registro', loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule) },

  // (opcional) acceso directo
  { path: 'splash-anim', loadChildren: () => import('./pages/splash-anim/splash-anim.module').then(m => m.SplashAnimPageModule) },

  // Cualquier otra ruta → login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
