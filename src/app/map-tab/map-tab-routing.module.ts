import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapTabPage } from './map-tab.page';

const routes: Routes = [
  {
    path: '',
    component: MapTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapTabPageRoutingModule {}
