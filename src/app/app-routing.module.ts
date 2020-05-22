import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/map-tab/map-tab.module').then((m) => m.MapTabPageModule),
  },
  {
    path: 'incident',
    loadChildren: () =>
      import('./incident/incident.module').then((m) => m.IncidentPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
