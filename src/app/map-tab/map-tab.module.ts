import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapTabPage } from './map-tab.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MapTabPageRoutingModule } from './map-tab-routing.module';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { environment } from './../../environments/environment';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MapTabPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
    }),
    AgmSnazzyInfoWindowModule,
    SharedModule,
  ],
  declarations: [MapTabPage],
})
export class MapTabPageModule {}
