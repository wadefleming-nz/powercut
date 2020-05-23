import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidentAddedPage } from './incident-added.page';

const routes: Routes = [
  {
    path: '',
    component: IncidentAddedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentAddedPageRoutingModule {}
