import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentPage } from './incident.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentPageRoutingModule {}
