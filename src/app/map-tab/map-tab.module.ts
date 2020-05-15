import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapTabPage } from './map-tab.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MapTabPageRoutingModule } from './map-tab-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MapTabPageRoutingModule,
  ],
  declarations: [MapTabPage],
})
export class MapTabPageModule {}
