import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FloatingButtonsComponent } from './floating-buttons/floating-buttons.component';
import { IncidentPopupComponent } from './incident-popup/incident-popup.component';
import { MapComponent } from './map/map.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { GoogleAddressSearchModule } from '../google-address-search/google-address-search.module';

const components = [
  FloatingButtonsComponent,
  IncidentPopupComponent,
  MapComponent,
];

@NgModule({
  declarations: components,
  imports: [
    IonicModule,
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places'],
    }),
    GoogleAddressSearchModule,
  ],
  exports: components,
})
export class ComponentsModule {}
