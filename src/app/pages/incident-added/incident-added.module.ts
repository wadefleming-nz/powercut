import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncidentAddedPageRoutingModule } from './incident-added-routing.module';

import { IncidentAddedPage } from './incident-added.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncidentAddedPageRoutingModule
  ],
  declarations: [IncidentAddedPage]
})
export class IncidentAddedPageModule {}
