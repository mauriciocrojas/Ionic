// src/app/tabs/tabs-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab3',
        loadChildren: () =>
          import('../tab3/tab3.module').then(m => m.Tab3PageModule),
      },
      { path: '', redirectTo: 'tab2', pathMatch: 'full' }, // tab por defecto
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
