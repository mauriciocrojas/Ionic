import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// (opcional) si ya tenés un AuthGuard, lo importás y lo usás en /tabs

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./tab1/tab1.module').then(m => m.Tab1LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
]


@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
